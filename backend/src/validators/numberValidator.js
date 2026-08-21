import { STRING_NUMBERS } from '../config/index.js';
export function validateNumber(answer) {
  if (typeof answer !== 'string') return false;
  const trimmed = answer.trim();
  const parsed = parseInt(trimmed, 10);
  if (!isNaN(parsed) && parsed.toString() === trimmed.split(/\s+/)[0]) {
    return parsed;
  }
  if (!isNaN(parsed)) {
    return parsed;
  }
  const firstWord = trimmed.toLowerCase().split(/\s+/)[0];
  const wordIndex = STRING_NUMBERS.indexOf(firstWord);
  if (wordIndex !== -1) {
    return wordIndex;
  }
  return false;
}
