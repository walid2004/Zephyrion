import { questionFlow } from '../data/questions.js';
export function validateAnswer(answer, phase) {
  if (phase < 0 || phase >= questionFlow.length) {
    return false;
  }
  const question = questionFlow[phase];
  if (!question || typeof question.validate !== 'function') {
    return false;
  }
  return question.validate(answer, question.options);
}
