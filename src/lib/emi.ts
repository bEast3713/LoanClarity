export type EmiResult = {
  monthly_emi: number;
  total_interest: number;
  total_payable: number;
  moratorium_interest: number;
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/**
 * EMI formula:
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 * where P = principal, r = monthly rate (annual/12/100), n = months
 */
export function calculateEmi(params: {
  principal: number;
  annualRatePercent: number;
  tenureMonths: number;
  moratoriumMonths?: number;
}) : EmiResult {
  const P = Math.max(0, params.principal);
  const n = Math.max(1, Math.floor(params.tenureMonths));
  const r = Math.max(0, params.annualRatePercent) / 12 / 100;

  let emi: number;
  if (r === 0) {
    emi = P / n;
  } else {
    const pow = Math.pow(1 + r, n);
    emi = (P * r * pow) / (pow - 1);
  }

  const totalPayable = emi * n;
  const totalInterest = totalPayable - P;

  const m = Math.max(0, Math.floor(params.moratoriumMonths ?? 0));
  const moratoriumInterest = m > 0 ? P * r * m : 0;

  return {
    monthly_emi: round2(emi),
    total_interest: round2(totalInterest),
    total_payable: round2(totalPayable),
    moratorium_interest: round2(moratoriumInterest),
  };
}

