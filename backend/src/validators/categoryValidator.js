export function validateCategory(answer, categoryLists = []) {
  if (typeof answer !== 'string' || !Array.isArray(categoryLists)) return false;
  const normalized = answer.trim().toLowerCase();
  const words = normalized.split(/\s+/);
  for (const list of categoryLists) {
    if (!Array.isArray(list) || list.length === 0) continue;
    for (const phrase of list) {
      if (phrase.includes(' ') || phrase.includes('-')) {
        if (normalized.includes(phrase.toLowerCase())) {
          return list[0];
        }
      }
    }
  }
  for (const word of words) {
    if (!word) continue;
    for (const list of categoryLists) {
      if (!Array.isArray(list) || list.length === 0) continue;
      for (const item of list) {
        if (item.toLowerCase() === word) {
          return list[0];
        }
      }
    }
  }
  return false;
}
