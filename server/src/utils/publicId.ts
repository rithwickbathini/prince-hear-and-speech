/** Generates a random 4-digit numeric string ("0000"-"9999"), preserving leading zeroes. */
export function generatePublicId(): string {
  return String(Math.floor(Math.random() * 10000)).padStart(4, "0");
}
