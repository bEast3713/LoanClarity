import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const QuerySchema = z.object({
  college: z.string().min(1),
  course: z.string().min(1),
});

type FeeRow = {
  year: number;
  tuition_fee: number | null;
  hostel_fee: number | null;
  books_fee?: number | null;
  exam_fee: number | null;
  misc_fee: number | null;
  updated_at: string | null;
};

function sumSafe(n: number, x: number | null | undefined) {
  return n + (typeof x === "number" ? x : 0);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    college: searchParams.get("college"),
    course: searchParams.get("course"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query params", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { college, course } = parsed.data;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Demo fallback: fixed 4-year pattern.
    const rows: FeeRow[] = [1, 2, 3, 4].map((year) => ({
      year,
      tuition_fee: year === 1 ? 250000 : 220000,
      hostel_fee: 90000,
      books_fee: 15000,
      exam_fee: 5000,
      misc_fee: 12000,
      updated_at: new Date().toISOString(),
    }));

    const totals = rows.reduce(
      (acc, r) => {
        acc.tuition = sumSafe(acc.tuition, r.tuition_fee);
        acc.hostel = sumSafe(acc.hostel, r.hostel_fee);
        acc.books = sumSafe(acc.books, r.books_fee);
        acc.exam = sumSafe(acc.exam, r.exam_fee);
        acc.misc = sumSafe(acc.misc, r.misc_fee);
        return acc;
      },
      { tuition: 0, hostel: 0, books: 0, exam: 0, misc: 0 },
    );

    const total_cost =
      totals.tuition + totals.hostel + totals.books + totals.exam + totals.misc;

    return NextResponse.json({
      college,
      course,
      updated_at: new Date().toISOString(),
      rows,
      totals,
      total_cost,
    });
  }

  const supabase = createSupabaseAdmin();

  let collegeId: string | null = null;
  if (college.startsWith("id:")) collegeId = college.slice(3);

  if (!collegeId && college.startsWith("name:")) {
    const collegeName = college.slice(5);
    const { data, error } = await supabase
      .from("colleges")
      .select("id")
      .ilike("name", collegeName)
      .limit(1)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    collegeId = data?.id ?? null;
  }

  if (!collegeId) {
    return NextResponse.json(
      { error: "College not found. Try selecting from autocomplete." },
      { status: 404 },
    );
  }

  const courseInput = course.trim();
  const courseNormalized = courseInput.replace(/\s+/g, " ");

  async function loadFees(opts: { match: "eq" | "ilike"; value: string }) {
    const q = supabase
      .from("course_fees")
      .select("year,tuition_fee,hostel_fee,exam_fee,misc_fee,updated_at")
      .eq("college_id", collegeId!)
      .order("year", { ascending: true });
    return opts.match === "eq"
      ? await q.eq("course", opts.value)
      : await q.ilike("course", opts.value);
  }

  // 1) Try exact match first (fast, uses index)
  let { data: rows, error: feeErr } = await loadFees({
    match: "eq",
    value: courseInput,
  });

  // 2) If that fails, try case-insensitive match (handles "b.tech cse" vs "B.Tech CSE")
  if (!feeErr && (rows ?? []).length === 0) {
    ({ data: rows, error: feeErr } = await loadFees({
      match: "ilike",
      value: courseInput,
    }));
  }

  // 3) If still empty, try whitespace-normalized match (handles accidental double spaces)
  if (!feeErr && (rows ?? []).length === 0 && courseNormalized !== courseInput) {
    ({ data: rows, error: feeErr } = await loadFees({
      match: "ilike",
      value: courseNormalized,
    }));
  }

  if (feeErr) return NextResponse.json({ error: feeErr.message }, { status: 500 });

  const safeRows: FeeRow[] = (rows ?? []) as FeeRow[];
  if (safeRows.length === 0) {
    const { data: available, error: availErr } = await supabase
      .from("course_fees")
      .select("course")
      .eq("college_id", collegeId)
      .order("course", { ascending: true });
    if (availErr) {
      return NextResponse.json({ error: availErr.message }, { status: 500 });
    }
    const availableCourses = Array.from(
      new Set((available ?? []).map((r) => (r as { course: string }).course).filter(Boolean)),
    );

    return NextResponse.json(
      {
        error:
          availableCourses.length > 0
            ? "No fee data for that exact course name at this college."
            : "No fee data for this college yet (course_fees is empty).",
        details: {
          college_id: collegeId,
          requested_course: courseInput,
          available_courses: availableCourses,
          hint:
            "Insert rows into public.course_fees for this college_id + course + year, or make sure your course string matches exactly (e.g. 'B.Tech CSE').",
        },
      },
      { status: 404 },
    );
  }

  const totals = safeRows.reduce(
    (acc, r) => {
      acc.tuition = sumSafe(acc.tuition, r.tuition_fee);
      acc.hostel = sumSafe(acc.hostel, r.hostel_fee);
      acc.exam = sumSafe(acc.exam, r.exam_fee);
      acc.misc = sumSafe(acc.misc, r.misc_fee);
      return acc;
    },
    { tuition: 0, hostel: 0, exam: 0, misc: 0 },
  );

  const total_cost = totals.tuition + totals.hostel + totals.exam + totals.misc;
  const updated_at =
    safeRows
      .map((r) => r.updated_at)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;

  return NextResponse.json({
    college_id: collegeId,
    course,
    updated_at,
    rows: safeRows,
    totals,
    total_cost,
  });
}

