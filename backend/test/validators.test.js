import { questionFlow } from '../src/data/questions.js';
import { validateAnswer } from '../src/validators/index.js';
import { buildSearchUrl } from '../src/services/queryBuilder.js';
console.log('Running backend test suite:');
const testCases = [
  { phase: 0, input: '40000', expected: 40000 },
  { phase: 1, input: '10000', expected: 10000 },
  { phase: 2, input: 'mercedes-benz', expected: 'mercedes-benz' },
  { phase: 3, input: 'c-class', expected: 'c-class' },
  { phase: 5, input: 'four', expected: 4 },
  { phase: 8, input: 'petrol', expected: 'petrol' },
  { phase: 14, input: 'carbon black', expected: 'black' },
  { phase: 20, input: 'suv', expected: 'suv' },
  { phase: 21, input: 'paddle shifters', expected: 'automatic_gear' }
];
let failed = false;
for (const tc of testCases) {
  const result = validateAnswer(tc.input, tc.phase);
  if (result !== tc.expected) {
    console.error(`[FAIL] Phase ${tc.phase} ("${tc.input}"): expected ${tc.expected}, got ${result}`);
    failed = true;
  } else {
    console.log(`[PASS] Phase ${tc.phase} ("${tc.input}"): -> ${result}`);
  }
}
const url = buildSearchUrl({ make: 'audi', priceUL: '50000', category: 'suv' });
if (!url.includes('make=audi') || !url.includes('category=suv')) {
  console.error('[FAIL] buildSearchUrl did not generate correct params');
  failed = true;
} else {
  console.log('[PASS] buildSearchUrl generated:', url);
}
if (failed) {
  process.exit(1);
} else {
  console.log('\nAll backend tests passed!');
}
