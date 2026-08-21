import { BASE_SEARCH_URL } from '../config/index.js';
export function buildSearchUrl(criteria = {}) {
  const {
    priceLL = '0',
    priceUL = '9999999',
    yearUL = '2025',
    yearLL = '2017',
    mileageLL = 0,
    mileageUL,
    performanceLL,
    performanceUL,
    emissions,
    category,
    bodyColor,
    interiorColor,
    maxOwners,
    interiorType,
    gearBox,
    electric,
    diesel,
    hybrid,
    petrol,
    hybrid_diesel,
    make,
    model,
    trim,
    feature,
    doors,
    vehicleCondition,
    consumptionUL,
    seats
  } = criteria;
  const params = [];
  if (priceUL || priceLL) {
    params.push(`priceRange=${priceLL}-${priceUL}`);
  }
  if (yearLL || yearUL) {
    params.push(`yearRange=${yearLL}-${yearUL}`);
  }
  if (mileageLL !== undefined || mileageUL !== undefined) {
    params.push(`mileageRange=${mileageLL || 0}-${mileageUL || ''}`);
  }
  if (performanceLL !== undefined || performanceUL !== undefined) {
    params.push(`performanceRange=${performanceLL || ''}-${performanceUL || ''}`);
  }
  if (category) {
    params.push(`category=${encodeURIComponent(category)}`);
  }
  if (bodyColor) {
    params.push(`bodyColor=${encodeURIComponent(bodyColor)}`);
  }
  if (interiorColor) {
    params.push(`interiorColor=${encodeURIComponent(interiorColor)}`);
  }
  if (maxOwners) {
    params.push(`maxOwners=${encodeURIComponent(maxOwners)}`);
  }
  if (interiorType) {
    params.push(`interiorType=${encodeURIComponent(interiorType)}`);
  }
  if (gearBox) {
    params.push(`gearBox=${encodeURIComponent(gearBox)}`);
  }
  const fuelValues = [electric, diesel, hybrid, petrol, hybrid_diesel].filter(Boolean).join('');
  if (fuelValues) {
    params.push(`fuelType=${encodeURIComponent(fuelValues)}`);
  }
  if (make) {
    params.push(`make=${encodeURIComponent(make)}`);
  }
  if (emissions) {
    params.push(`emissionClass=${encodeURIComponent(emissions)}`);
  }
  if (model) {
    params.push(`model=${encodeURIComponent(model)}`);
  }
  if (trim) {
    params.push(`trim=${encodeURIComponent(trim)}`);
  }
  if (feature) {
    params.push(`feature=${encodeURIComponent(feature)}`);
  }
  if (seats) {
    params.push(`seats=${encodeURIComponent(seats)}`);
  }
  if (consumptionUL) {
    params.push(`consumptionRange=0-${encodeURIComponent(consumptionUL)}`);
  }
  if (doors) {
    params.push(`doors=${encodeURIComponent(doors)}`);
  }
  if (vehicleCondition) {
    params.push(`vehicleCondition=${encodeURIComponent(vehicleCondition)}`);
  }
  return `${BASE_SEARCH_URL}${params.join('&')}`;
}
