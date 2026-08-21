export const IntentTypes = {
  START: 'START',
  FINISH: 'FINISH',
  SKIP: 'SKIP',
  STATUS: 'STATUS',
  RESTART: 'RESTART',
  HELP: 'HELP',
  ANSWER: 'ANSWER'
};
const FINISH_PATTERNS = [
  /^xx_finalize_xx$/i,
  /^finish$/i,
  /^done$/i,
  /^ready$/i,
  /^search$/i,
  /^search now$/i,
  /^find cars$/i,
  /^find my car$/i,
  /^find cars now$/i,
  /^show results$/i,
  /^show me the cars$/i,
  /^show cars$/i,
  /^that'?s (all|enough|it)$/i,
  /^enough$/i,
  /^let'?s (see|go|search)$/i,
  /^get results$/i
];
const SKIP_PATTERNS = [
  /^skip$/i,
  /^pass$/i,
  /^next$/i,
  /^any$/i,
  /^anything$/i,
  /^no preference$/i,
  /^doesn'?t matter$/i,
  /^don'?t care$/i,
  /^whatever$/i,
  /^no$/i,
  /^none$/i,
  /^idk$/i,
  /^i don'?t know$/i,
  /^not sure$/i,
  /^leave blank$/i
];
const STATUS_PATTERNS = [
  /^summary$/i,
  /^filters$/i,
  /^status$/i,
  /^my criteria$/i,
  /^what do you have(\s+so\s+far)?$/i,
  /^show (my )?filters$/i,
  /^current filters$/i
];
const RESTART_PATTERNS = [
  /^restart$/i,
  /^start over$/i,
  /^reset$/i,
  /^new search$/i,
  /^clear$/i
];
const HELP_PATTERNS = [
  /^help$/i,
  /^what can i say$/i,
  /^how does this work$/i,
  /^options$/i
];
export function classifyIntent(text) {
  if (typeof text !== 'string') return IntentTypes.ANSWER;
  const trimmed = text.trim();
  if (trimmed === 'xx_starting_xx') {
    return IntentTypes.START;
  }
  for (const pattern of FINISH_PATTERNS) {
    if (pattern.test(trimmed)) return IntentTypes.FINISH;
  }
  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(trimmed)) return IntentTypes.SKIP;
  }
  for (const pattern of STATUS_PATTERNS) {
    if (pattern.test(trimmed)) return IntentTypes.STATUS;
  }
  for (const pattern of RESTART_PATTERNS) {
    if (pattern.test(trimmed)) return IntentTypes.RESTART;
  }
  for (const pattern of HELP_PATTERNS) {
    if (pattern.test(trimmed)) return IntentTypes.HELP;
  }
  return IntentTypes.ANSWER;
}
