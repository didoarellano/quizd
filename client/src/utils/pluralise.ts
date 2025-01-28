export function pluralise(
  word: string,
  count: number,
  pluralForm?: string
): string {
  return count === 1 ? word : pluralForm || word + "s";
}
