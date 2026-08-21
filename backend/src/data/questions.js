import { carManufacturers } from './manufacturers.js';
import { combustionFuel, hybridFuel, electricFuel, dieselFuel } from './fuelTypes.js';
import { allGearboxes } from './gearboxes.js';
import { allBodyColors, allInteriorColors } from './colors.js';
import { allBodyTypes } from './bodyTypes.js';
import { allCo2 } from './emissions.js';
import { validateNumber } from '../validators/numberValidator.js';
import { validateNormalText, validateStrictKeyword, validateManufacturer } from '../validators/keywordValidator.js';
import { validateCategory } from '../validators/categoryValidator.js';
export const questionFlow = [
  {
    q: "What’s the maximum price you're considering?",
    validate: validateNumber,
    options: null,
    factor: 'priceUL'
  },
  {
    q: "Is there a minimum price which you do not want to below? if so, please specify it.",
    validate: validateNumber,
    options: null,
    factor: 'priceLL'
  },
  {
    q: "Which car brand or make do you prefer?",
    validate: validateManufacturer,
    options: carManufacturers,
    factor: 'make'
  },
  {
    q: "Any specific model in mind?",
    validate: validateNormalText,
    options: null,
    factor: 'model'
  },
  {
    q: "Do you care about a specific variant or trim level?",
    validate: validateNormalText,
    options: null,
    factor: 'trim'
  },
  {
    q: "How many doors should the car have?",
    validate: validateNumber,
    options: null,
    factor: 'doors'
  },
  {
    q: "How many seats should the car have?",
    validate: validateNumber,
    options: null,
    factor: 'seats'
  },
  {
    q: "What's the top mileage limit? (In kilometers)",
    validate: validateNumber,
    options: null,
    factor: 'mileageUL'
  },
  {
    q: "I know it is a bit of a naive question, but just to make sure, you are okay with Petrol Cars (Internal compustion Engines)",
    validate: validateStrictKeyword,
    options: combustionFuel,
    factor: 'petrol'
  },
  {
    q: "What's an appropriate gasmileage consumption? (In liters/km)",
    validate: validateNumber,
    options: null,
    factor: 'consumptionUL'
  },
  {
    q: "Are you interested in a hybrid vehicle?",
    validate: validateStrictKeyword,
    options: hybridFuel,
    factor: 'hybrid'
  },
  {
    q: "Are you interested in a diesel vehicle?",
    validate: validateStrictKeyword,
    options: dieselFuel,
    factor: 'diesel'
  },
  {
    q: "How about Electric cars?",
    validate: validateStrictKeyword,
    options: electricFuel,
    factor: 'electric'
  },
  {
    q: "Do you care about CO₂ emissions?",
    validate: validateCategory,
    options: allCo2,
    factor: 'emissions'
  },
  {
    q: "Do you have a preferred body color?",
    validate: validateCategory,
    options: allBodyColors,
    factor: 'bodyColor'
  },
  {
    q: "What about the interior, do you have a preferred interior color?",
    validate: validateCategory,
    options: allInteriorColors,
    factor: 'interiorColor'
  },
  {
    q: "Any specific minimum year you're targeting?",
    validate: validateNumber,
    options: null,
    factor: 'yearLL'
  },
  {
    q: "what is the latest model year you are looking for?",
    validate: validateNumber,
    options: null,
    factor: 'yearUL'
  },
  {
    q: "What’s the minimum horsepower you would not go under in your car?",
    validate: validateNumber,
    options: null,
    factor: 'performanceLL'
  },
  {
    q: "Do you have an upper bound for the horsepower you would like to have?",
    validate: validateNumber,
    options: null,
    factor: 'performanceUL'
  },
  {
    q: "What body type are you looking for? (e.g. sedan, SUV, hatchback)",
    validate: validateCategory,
    options: allBodyTypes,
    factor: 'category'
  },
  {
    q: "What kind of transmission do you prefer? (manual, automatic, CVT, etc.)",
    validate: validateCategory,
    options: allGearboxes,
    factor: 'gearBox'
  }
];
