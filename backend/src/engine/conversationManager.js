import { classifyIntent, IntentTypes } from './intentClassifier.js';
import { extractEntities } from './entityExtractor.js';
import { validateAnswer } from '../validators/index.js';
import { questionFlow } from '../data/questions.js';
import { scrapeCars } from '../services/scraperService.js';
export const EXAMPLE_CARS = [
  'White Audi A4 Avant under 30k diesel',
  'Red Porsche 911 Coupe under 85k automatic',
  'Grey Volkswagen Golf GTI under 25k petrol',
  'Blue Mercedes-Benz C-Class under 35k automatic',
  'Black BMW X5 SUV under 45k hybrid',
  'Silver Tesla Model 3 under 32k electric',
  'Green Ford Mustang Convertible under 40k manual'
];
export function getRandomCarExample() {
  const index = Math.floor(Math.random() * EXAMPLE_CARS.length);
  return EXAMPLE_CARS[index];
}
export const PRIORITY_FACTORS = [
  'priceUL',
  'make',
  'model',
  'category',
  'gearBox',
  'petrol',
  'yearLL',
  'mileageUL',
  'bodyColor',
  'doors',
  'performanceLL'
];
export const FACTOR_LABELS = {
  priceUL: 'Max Price',
  priceLL: 'Min Price',
  make: 'Brand / Make',
  model: 'Model',
  category: 'Body Style',
  gearBox: 'Transmission',
  petrol: 'Petrol',
  diesel: 'Diesel',
  hybrid: 'Hybrid',
  electric: 'Electric',
  bodyColor: 'Exterior Color',
  interiorColor: 'Interior Color',
  yearLL: 'Min Year',
  yearUL: 'Max Year',
  mileageUL: 'Max Mileage',
  performanceLL: 'Min Power (HP)',
  doors: 'Doors',
  seats: 'Seats',
  emissions: 'Emissions'
};
const FACTOR_EXAMPLES = {
  priceUL: 'e.g. "30000", "under 25k", "max 40000 euros"',
  priceLL: 'e.g. "5000", "at least 10k"',
  make: 'e.g. "BMW", "Audi", "Mercedes-Benz", "Volkswagen", "Tesla"',
  model: 'e.g. "A4", "3 Series", "Golf", "Model 3"',
  category: 'e.g. "SUV", "Sedan", "Hatchback", "Coupe", "Wagon"',
  gearBox: 'e.g. "Automatic", "Manual", "Paddle shifters"',
  petrol: 'e.g. "Petrol", "Diesel", "Hybrid", "Electric"',
  yearLL: 'e.g. "2018", "newer than 2020"',
  mileageUL: 'e.g. "100000", "under 80k km"',
  bodyColor: 'e.g. "Black", "Grey", "White", "Blue", "Red"',
  doors: 'e.g. "4", "5 doors", "3 doors"',
  performanceLL: 'e.g. "150 hp", "200 ps"'
};
export class ConversationSession {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.criteria = {};
    this.skippedFactors = new Set();
    this.currentPhaseIndex = 0;
  }
  getCriteriaSummary() {
    const keys = Object.keys(this.criteria);
    if (keys.length === 0) {
      return 'No filters selected yet.';
    }
    return keys
      .map((k) => `• ${FACTOR_LABELS[k] || k}: ${this.formatValue(k, this.criteria[k])}`)
      .join('\n');
  }
  formatValue(key, val) {
    if (key.includes('price')) return `€${Number(val).toLocaleString()}`;
    if (key.includes('mileage')) return `${Number(val).toLocaleString()} km`;
    if (key.includes('performance')) return `${val} HP`;
    if (key === 'gearBox') return val === 'automatic_gear' ? 'Automatic' : 'Manual';
    if (typeof val === 'string') return val.charAt(0).toUpperCase() + val.slice(1);
    return val;
  }
  getNextUnansweredFactor() {
    for (const factor of PRIORITY_FACTORS) {
      if (this.criteria[factor] === undefined && !this.skippedFactors.has(factor)) {
        return factor;
      }
    }
    for (const q of questionFlow) {
      if (this.criteria[q.factor] === undefined && !this.skippedFactors.has(q.factor)) {
        return q.factor;
      }
    }
    return null;
  }
  getQuestionForFactor(factor) {
    const found = questionFlow.find((q) => q.factor === factor);
    return found ? found.q : 'Any other preferences?';
  }
  getQuestionIndexForFactor(factor) {
    return questionFlow.findIndex((q) => q.factor === factor);
  }
  async processMessage(text = '') {
    const rawText = (text || '').trim();
    const intent = classifyIntent(rawText);
    if (intent === IntentTypes.START) {
      this.criteria = {};
      this.skippedFactors.clear();
      const firstFactor = PRIORITY_FACTORS[0];
      const qText = this.getQuestionForFactor(firstFactor);
      const exampleCar = getRandomCarExample();
      return {
        message: `Hi there! I am Zephyrion, your car finding assistant.\nI will help you find your ideal car quickly.\n\n${qText}\n\nTip: You can mention multiple preferences at once (e.g. "${exampleCar}") or type "finish" at any point to see matches!`,
        criteria: this.criteria,
        phase: 0,
        isFinished: false
      };
    }
    if (intent === IntentTypes.FINISH) {
      return await this.finishAndSearch();
    }
    if (intent === IntentTypes.RESTART) {
      this.criteria = {};
      this.skippedFactors.clear();
      const firstFactor = PRIORITY_FACTORS[0];
      return {
        message: `Conversation restarted! Let's start fresh.\n\n${this.getQuestionForFactor(firstFactor)}`,
        criteria: this.criteria,
        phase: 0,
        isFinished: false
      };
    }
    if (intent === IntentTypes.STATUS) {
      const summary = this.getCriteriaSummary();
      const nextFactor = this.getNextUnansweredFactor();
      const nextQ = nextFactor ? `\n\n${this.getQuestionForFactor(nextFactor)}` : '\n\nReady to search! Type "finish" to view your cars.';
      return {
        message: `Current Filters:\n${summary}${nextQ}`,
        criteria: this.criteria,
        phase: this.currentPhaseIndex,
        isFinished: false
      };
    }
    if (intent === IntentTypes.HELP) {
      const nextFactor = this.getNextUnansweredFactor();
      const exampleCar = getRandomCarExample();
      return {
        message: `Here is what you can do:\n• Describe what you want naturally (e.g., "${exampleCar}")\n• Type "finish" or click "Find Cars Now" to get instant results\n• Type "skip" to pass any question\n• Type "status" to see your selected filters\n• Type "restart" to start over\n\n${this.getQuestionForFactor(nextFactor)}`,
        criteria: this.criteria,
        phase: this.currentPhaseIndex,
        isFinished: false
      };
    }
    const currentFactor = this.getNextUnansweredFactor() || PRIORITY_FACTORS[0];
    if (intent === IntentTypes.SKIP) {
      this.skippedFactors.add(currentFactor);
      const nextFactor = this.getNextUnansweredFactor();
      if (!nextFactor) {
        return await this.finishAndSearch();
      }
      return {
        message: `Skipped.\n\n${this.getQuestionForFactor(nextFactor)}`,
        criteria: this.criteria,
        phase: this.getQuestionIndexForFactor(nextFactor),
        isFinished: false
      };
    }
    const extracted = extractEntities(rawText, { currentFactor });
    const extractedKeys = Object.keys(extracted);
    if (extractedKeys.length > 0) {
      Object.assign(this.criteria, extracted);
      const addedList = extractedKeys
        .map((k) => `${FACTOR_LABELS[k] || k}: ${this.formatValue(k, extracted[k])}`)
        .join(', ');
      const nextFactor = this.getNextUnansweredFactor();
      if (!nextFactor) {
        return await this.finishAndSearch(`Got it! Added ${addedList}.\n\n`);
      }
      const nextQ = this.getQuestionForFactor(nextFactor);
      return {
        message: `Got it! Set ${addedList}.\n\n${nextQ}`,
        criteria: this.criteria,
        phase: this.getQuestionIndexForFactor(nextFactor),
        isFinished: false
      };
    }
    const phaseIdx = this.getQuestionIndexForFactor(currentFactor);
    const directValidated = validateAnswer(rawText, phaseIdx);
    if (directValidated !== false && directValidated !== undefined) {
      this.criteria[currentFactor] = directValidated;
      const nextFactor = this.getNextUnansweredFactor();
      if (!nextFactor) {
        return await this.finishAndSearch();
      }
      return {
        message: this.getQuestionForFactor(nextFactor),
        criteria: this.criteria,
        phase: this.getQuestionIndexForFactor(nextFactor),
        isFinished: false
      };
    }
    const example = FACTOR_EXAMPLES[currentFactor] || 'e.g. type your preference or "skip"';
    return {
      message: `I didn't quite catch that for ${FACTOR_LABELS[currentFactor] || currentFactor}.\n(${example})\n\n${this.getQuestionForFactor(currentFactor)}\n\n(Tip: Type "skip" to pass, or "finish" to search now)`,
      criteria: this.criteria,
      phase: phaseIdx,
      isFinished: false
    };
  }
  async finishAndSearch(prefix = '') {
    console.log(`[ConversationManager] Finalizing search with criteria:`, this.criteria);
    const cars = await scrapeCars(this.criteria);
    const criteriaCount = Object.keys(this.criteria).length;
    const summary = criteriaCount > 0 ? `\n\nApplied Filters:\n${this.getCriteriaSummary()}` : '';
    return {
      message: `${prefix}Here are the best matches I found for you:\n\n${cars}${summary}\n\nType "restart" to start a new search!`,
      criteria: this.criteria,
      phase: 99,
      isFinished: true
    };
  }
}
