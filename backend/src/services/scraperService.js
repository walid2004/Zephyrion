import { scrapeGermanCarPortals, formatCarResults } from './marketScraper.js';
export async function scrapeCars(criteria = {}) {
  try {
    const result = await scrapeGermanCarPortals(criteria);
    return formatCarResults(result);
  } catch (error) {
    console.error('[ScraperService] Error in scrapeCars:', error.message);
    return 'Could not retrieve live listings at this moment. Please check back shortly!';
  }
}
