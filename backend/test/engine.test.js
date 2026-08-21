import { ConversationSession } from '../src/engine/conversationManager.js';
import { extractEntities } from '../src/engine/entityExtractor.js';
import { classifyIntent, IntentTypes } from '../src/engine/intentClassifier.js';
console.log('--- Testing Conversational Engine ---');
console.log('\n1. Testing Intent Classifier:');
const finishIntents = ['finish', 'done', 'search now', 'find cars', 'show results', 'ready'];
for (const phrase of finishIntents) {
  const intent = classifyIntent(phrase);
  if (intent !== IntentTypes.FINISH) {
    console.error(`[FAIL] Expected FINISH for "${phrase}", got ${intent}`);
    process.exit(1);
  }
}
console.log('[PASS] All FINISH intents classified correctly.');
const skipIntents = ['skip', 'any', 'anything', 'no preference', 'next', 'whatever'];
for (const phrase of skipIntents) {
  const intent = classifyIntent(phrase);
  if (intent !== IntentTypes.SKIP) {
    console.error(`[FAIL] Expected SKIP for "${phrase}", got ${intent}`);
    process.exit(1);
  }
}
console.log('[PASS] All SKIP intents classified correctly.');
console.log('\n2. Testing Multi-Entity Extraction:');
const multiPhrase = 'I want a black automatic Audi SUV under 35k with 5 doors';
const extracted = extractEntities(multiPhrase);
console.log('Extracted from: "' + multiPhrase + '":', extracted);
if (
  extracted.make !== 'audi' ||
  extracted.bodyColor !== 'black' ||
  extracted.gearBox !== 'automatic_gear' ||
  extracted.category !== 'suv' ||
  extracted.priceUL !== 35000 ||
  extracted.doors !== 5
) {
  console.error('[FAIL] Multi-entity extraction failed to extract all fields correctly!');
  process.exit(1);
}
console.log('[PASS] Multi-entity extraction passed!');
console.log('\n3. Testing Conversation Flow & Instant Finish:');
async function testSession() {
  const session = new ConversationSession('test-user');
  const startRes = await session.processMessage('xx_starting_xx');
  console.log('[Turn 1 - Start]:', startRes.message.split('\n')[0]);
  const answerRes = await session.processMessage('Looking for a BMW 3 series under 30000 euros');
  console.log('\n[Turn 2 - Multi-answer]:', answerRes.message);
  console.log('Session criteria:', session.criteria);
  if (session.criteria.make !== 'bmw' || session.criteria.priceUL !== 30000) {
    console.error('[FAIL] Criteria was not saved in session!');
    process.exit(1);
  }
  const finishRes = await session.processMessage('find cars now');
  console.log('\n[Turn 3 - Instant Finish]:', finishRes.message);
  if (!finishRes.isFinished) {
    console.error('[FAIL] Expected isFinished=true after finish command!');
    process.exit(1);
  }
  console.log('[PASS] Instant finish at any point works seamlessly!');
  const session2 = new ConversationSession('test-user-2');
  await session2.processMessage('xx_starting_xx');
  const fallbackRes = await session2.processMessage('some completely random gibberish xyz');
  console.log('\n[Turn 4 - Fallback Response]:', fallbackRes.message);
  if (!fallbackRes.message.includes('Tip: Type "skip" to pass, or "finish" to search now')) {
    console.error('[FAIL] Fallback did not include helpful options and guidance!');
    process.exit(1);
  }
  console.log('[PASS] Smart fallback with interactive options works!');
  console.log('\nALL ENGINE TESTS PASSED SUCCESSFULLY! 🎉');
}
testSession();
