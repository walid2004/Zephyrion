import { carManufacturers } from '../data/manufacturers.js';
import { combustionFuel, hybridFuel, electricFuel, dieselFuel } from '../data/fuelTypes.js';
import { allGearboxes } from '../data/gearboxes.js';
import { allBodyColors, allInteriorColors } from '../data/colors.js';
import { allBodyTypes } from '../data/bodyTypes.js';
import { allCo2 } from '../data/emissions.js';
import { validateCategory } from '../validators/categoryValidator.js';
import { validateNumber } from '../validators/numberValidator.js';
function parsePriceOrNumber(str) {
  if (!str) return null;
  const clean = str.toString().toLowerCase().replace(/[€$,.]/g, '').trim();
  if (clean.endsWith('k')) {
    const num = parseFloat(clean.slice(0, -1));
    return isNaN(num) ? null : Math.round(num * 1000);
  }
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? null : parsed;
}
export function extractEntities(text, context = {}) {
  if (typeof text !== 'string') return {};
  const normalized = text.trim().toLowerCase();
  const extracted = {};
  const rangeMatch = normalized.match(/(?:between|from)?\s*(\d+[\d.,]*k?)\s*(?:and|to|-)\s*(\d+[\d.,]*k?)/i);
  if (rangeMatch) {
    const min = parsePriceOrNumber(rangeMatch[1]);
    const max = parsePriceOrNumber(rangeMatch[2]);
    if (min && max) {
      extracted.priceLL = Math.min(min, max);
      extracted.priceUL = Math.max(min, max);
    }
  }
  if (!extracted.priceUL) {
    const maxMatch = normalized.match(/(?:under|max|maximum|less than|up to|below|budget(?:\s+of)?|cheaper than)\s*(\d+[\d.,]*k?)/i);
    if (maxMatch) {
      const price = parsePriceOrNumber(maxMatch[1]);
      if (price) extracted.priceUL = price;
    }
  }
  if (!extracted.priceLL) {
    const minMatch = normalized.match(/(?:above|min|minimum|at least|more than|over)\s*(\d+[\d.,]*k?)/i);
    if (minMatch) {
      const price = parsePriceOrNumber(minMatch[1]);
      if (price) extracted.priceLL = price;
    }
  }
  if (!extracted.priceUL && !extracted.priceLL) {
    if (context.currentFactor === 'priceUL' || context.currentFactor === 'priceLL') {
      const directNum = validateNumber(normalized);
      if (directNum !== false) {
        extracted[context.currentFactor] = directNum;
      }
    }
  }
  for (const make of carManufacturers) {
    if (make === 'no') continue;
    const regex = new RegExp(`\\b${make}\\b`, 'i');
    if (regex.test(normalized)) {
      extracted.make = make;
      break;
    }
  }
  const bodyType = validateCategory(normalized, allBodyTypes);
  if (bodyType) {
    extracted.category = bodyType;
  }
  const gearbox = validateCategory(normalized, allGearboxes);
  if (gearbox) {
    extracted.gearBox = gearbox;
  }
  if (/\b(petrol|gasoline|gas|ice)\b/i.test(normalized)) {
    extracted.petrol = 'petrol';
  }
  if (/\b(diesel|tdi)\b/i.test(normalized)) {
    extracted.diesel = 'diesel';
  }
  if (/\b(hybrid|plug-in|phev)\b/i.test(normalized)) {
    extracted.hybrid = 'hybrid';
  }
  if (/\b(electric|ev|bev|zero emission)\b/i.test(normalized)) {
    extracted.electric = 'electric';
  }
  const interiorMatch = normalized.match(/(?:interior|inside|cabin|seats?)\s+(?:in\s+)?([a-z]+)/i) ||
                        normalized.match(/([a-z]+)\s+(?:interior|inside|cabin|seats?)/i);
  if (interiorMatch) {
    const intColor = validateCategory(interiorMatch[1], allInteriorColors);
    if (intColor) extracted.interiorColor = intColor;
  }
  const bodyColor = validateCategory(normalized, allBodyColors);
  if (bodyColor && !extracted.interiorColor) {
    extracted.bodyColor = bodyColor;
  }
  const yearMatch = normalized.match(/(?:newer than|after|from|min year|minimum year)\s*(\b20\d{2}\b)/i);
  if (yearMatch) {
    extracted.yearLL = parseInt(yearMatch[1], 10);
  }
  const yearMaxMatch = normalized.match(/(?:older than|before|up to|max year)\s*(\b20\d{2}\b)/i);
  if (yearMaxMatch) {
    extracted.yearUL = parseInt(yearMaxMatch[1], 10);
  }
  const mileageMatch = normalized.match(/(?:under|max|less than|up to)\s*(\d+[\d.,]*k?)\s*(?:km|kms|kilometers|miles)?/i);
  if (mileageMatch && (normalized.includes('km') || normalized.includes('mileage') || context.currentFactor === 'mileageUL')) {
    const mileage = parsePriceOrNumber(mileageMatch[1]);
    if (mileage) extracted.mileageUL = mileage;
  }
  const emission = validateCategory(normalized, allCo2);
  if (emission) {
    extracted.emissions = emission;
  }
  const doorsMatch = normalized.match(/(\d+)\s*(?:doors|door)/i);
  if (doorsMatch) extracted.doors = parseInt(doorsMatch[1], 10);
  const seatsMatch = normalized.match(/(\d+)\s*(?:seats|seater|seat)/i);
  if (seatsMatch) extracted.seats = parseInt(seatsMatch[1], 10);
  const hpMatch = normalized.match(/(?:at least|min|above)?\s*(\d+)\s*(?:hp|ps|horsepower|bhp)/i);
  if (hpMatch) extracted.performanceLL = parseInt(hpMatch[1], 10);
  return extracted;
}
