/** Toggle `option` in `selected`; the exclusive option clears all others, and any other option clears it. */
export function toggleExclusive(selected: string[], option: string, exclusiveOption: string): string[] {
  if (selected.includes(option)) return selected.filter((x) => x !== option);
  if (option === exclusiveOption) return [option];
  return [...selected.filter((x) => x !== exclusiveOption), option];
}
