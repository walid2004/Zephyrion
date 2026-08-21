export function validateNormalText(answer) {
  if (typeof answer !== 'string') return '';
  return answer.trim().toLowerCase().split(/\s+/)[0] || '';
}
export function validateStrictKeyword(answer, checklist = []) {
  if (typeof answer !== 'string' || !Array.isArray(checklist)) return false;
  const normalized = answer.toLowerCase();
  const words = normalized.split(/\s+/);
  for (const item of checklist) {
    if (normalized.includes(item.toLowerCase())) {
      return checklist[0];
    }
  }
  for (const word of words) {
    if (checklist.includes(word)) {
      return checklist[0];
    }
  }
  return false;
}
export function validateManufacturer(answer, checklist = []) {
  if (typeof answer !== 'string' || !Array.isArray(checklist)) return false;
  const normalized = answer.trim().toLowerCase();
  for (const item of checklist) {
    if (normalized === item) {
      return item;
    }
  }
  for (const item of checklist) {
    if (normalized.includes(item)) {
      return item;
    }
  }
  const words = normalized.split(/\s+/);
  for (const word of words) {
    if (checklist.includes(word)) {
      return word;
    }
  }
  return false;
}
