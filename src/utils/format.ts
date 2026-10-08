/** Clock string for the round timer: 45 -> "0:45". */
export function clock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return m + ':' + (rest < 10 ? '0' + rest : String(rest));
}

/** Accuracy as a whole percentage string, e.g. "86%". */
export function percent(correct: number, mistakes: number): string {
  const total = correct + mistakes;
  if (total <= 0) {
    return '0%';
  }
  return Math.round((correct / total) * 100) + '%';
}
