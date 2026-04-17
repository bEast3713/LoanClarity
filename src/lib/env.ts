export function env(key: string): string | undefined {
  const v = process.env[key];
  return v && v.length > 0 ? v : undefined;
}

export function requireEnv(key: string): string {
  const v = env(key);
  if (!v) throw new Error(`Missing environment variable: ${key}`);
  return v;
}

