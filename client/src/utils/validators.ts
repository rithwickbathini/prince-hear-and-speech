export function isValidPhone(value: string): boolean {
  return /^[+]?[\d\s()-]{6,20}$/.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
