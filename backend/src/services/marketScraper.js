import axios from 'axios';
import * as cheerio from 'cheerio';

const REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache'
};

const AUTOSCOUT_BODY_MAP = {
  suv: '6',
  limousine: '3',
  kombi: '4',
  sportscar: '5',
  cabrio: '2',
  kompaktklasse: '1',
  kleinwagen: '1',
  van: '7',
  transportutility: '7'
};

const AUTOSCOUT_COLOR_MAP = {
  beige: '1',
  blue: '2',
  brown: '3',
  yellow: '5',
  grey: '6',
  green: '7',
  red: '9',
  black: '10',
  silver: '11',
  purple: '12',
  white: '13',
  orange: '14'
};

export function buildAutoScoutUrl(criteria = {}) {
  const {
    make,
    model,
    priceUL,
    priceLL,
    yearLL,
    yearUL,
    mileageUL,
    performanceLL,
    category,
    gearBox,
    petrol,
    diesel,
    electric,
    hybrid,
    bodyColor,
    doors
  } = criteria;

  let path = 'https://www.autoscout24.de/lst';

  if (make) {
    const formattedMake = make.toLowerCase().replace(/\s+/g, '-');
    path += `/${encodeURIComponent(formattedMake)}`;
    if (model) {
      const formattedModel = model.toLowerCase().replace(/\s+/g, '-');
      path += `/${encodeURIComponent(formattedModel)}`;
    }
  }

  const params = new URLSearchParams();
  params.append('sort', 'standard');
  params.append('desc', '0');
  params.append('ustate', 'N,U');
  params.append('size', '15');
  params.append('page', '1');

  if (priceUL) params.append('priceto', priceUL.toString());
  if (priceLL) params.append('pricefrom', priceLL.toString());
  if (yearLL) params.append('fregfrom', yearLL.toString());
  if (yearUL) params.append('fregto', yearUL.toString());
  if (mileageUL) params.append('kmto', mileageUL.toString());
  if (performanceLL) params.append('powerfrom', performanceLL.toString());

  if (gearBox === 'automatic_gear') {
    params.append('gear', 'A');
  } else if (gearBox === 'manual_gear') {
    params.append('gear', 'M');
  }

  const fuels = [];
  if (petrol) fuels.push('B');
  if (diesel) fuels.push('D');
  if (electric) fuels.push('E');
  if (hybrid) fuels.push('2');
  if (fuels.length > 0) {
    params.append('fuel', fuels.join(','));
  }

  if (category && AUTOSCOUT_BODY_MAP[category.toLowerCase()]) {
    params.append('body', AUTOSCOUT_BODY_MAP[category.toLowerCase()]);
  }

  if (bodyColor && AUTOSCOUT_COLOR_MAP[bodyColor.toLowerCase()]) {
    params.append('bodycolor', AUTOSCOUT_COLOR_MAP[bodyColor.toLowerCase()]);
  }

  if (doors) {
    if (doors >= 4) params.append('doorfrom', '4');
    else if (doors <= 3) params.append('doorto', '3');
  }

  return `${path}?${params.toString()}`;
}

export function buildMobileDeUrl(criteria = {}) {
  const { make, model, priceUL, priceLL, yearLL, mileageUL } = criteria;
  const params = new URLSearchParams();
  params.append('isSearchRequest', 'true');
  params.append('s', 'Car');
  params.append('vc', 'Car');
  params.append('dam', 'false');

  if (priceUL) params.append('maxPrice', priceUL.toString());
  if (priceLL) params.append('minPrice', priceLL.toString());
  if (yearLL) params.append('minFirstRegistrationDate', yearLL.toString());
  if (mileageUL) params.append('maxMileage', mileageUL.toString());

  return `https://suchen.mobile.de/fahrzeuge/search.html?${params.toString()}`;
}

export async function scrapeGermanCarPortals(criteria = {}) {
  const searchUrl = buildAutoScoutUrl(criteria);
  const mobileUrl = buildMobileDeUrl(criteria);
  console.log(`[MarketScraper] Fetching live German listings from: ${searchUrl}`);

  try {
    const res = await axios.get(searchUrl, {
      headers: REQUEST_HEADERS,
      timeout: 10000
    });

    const $ = cheerio.load(res.data);
    const cars = [];

    $('article').each((i, el) => {
      if (cars.length >= 6) return;

      const titlePrimary = $(el).find('span[class*="ListItemTitle_title"]').text().trim();
      const titleSubtitle = $(el).find('span[class*="ListItemTitle_subtitle"]').text().trim();
      const title = [titlePrimary, titleSubtitle].filter(Boolean).join(' ') || $(el).find('h2').text().trim();

      const price = $(el).find('[data-testid="regular-price"]').text().trim() ||
                    $(el).find('p[class*="Price_price"], span[class*="Price"]').first().text().trim();

      const year = $(el).find('[data-testid="VehicleDetails-calendar"] span[class*="ListItemPill_text"]').text().trim();
      const mileage = $(el).find('[data-testid="VehicleDetails-mileage_odometer"] span[class*="ListItemPill_text"]').text().trim();
      const fuel = $(el).find('[data-testid="VehicleDetails-gas_pump"] span[class*="ListItemPill_text"]').text().trim();
      const power = $(el).find('[data-testid="VehicleDetails-speedometer"] span[class*="ListItemPill_text"]').text().trim();
      const location = $(el).find('[data-testid="dealer-address"]').text().trim();

      const href = $(el).find('a[class*="ListItemTitle_anchor"], a[href*="/angebote/"]').attr('href') || '';
      const link = href ? (href.startsWith('http') ? href : `https://www.autoscout24.de${href}`) : searchUrl;

      if (title && price && !price.toLowerCase().includes('ab ')) {
        cars.push({
          title,
          price: price.replace(/\s+/g, ' ').trim(),
          year: year || 'N/A',
          mileage: mileage || 'N/A',
          fuel: fuel || 'N/A',
          power: power || '',
          location: location || 'Germany',
          link
        });
      }
    });

    return { cars, searchUrl, mobileUrl };
  } catch (error) {
    console.error('[MarketScraper] Failed to fetch live data:', error.message);
    return { cars: [], searchUrl, mobileUrl };
  }
}

export function formatCarResults({ cars, searchUrl, mobileUrl }) {
  if (!cars || cars.length === 0) {
    return `No exact matches found with those strict criteria.\n\nBrowse full inventory on German marketplaces:\n• AutoScout24: ${searchUrl}\n• Mobile.de: ${mobileUrl}`;
  }

  const listings = cars.map((c, index) => {
    const specs = [c.year !== 'N/A' ? c.year : null, c.mileage !== 'N/A' ? c.mileage : null, c.fuel !== 'N/A' ? c.fuel : null, c.power || null]
      .filter(Boolean)
      .join(' | ');

    return `${index + 1}. ${c.title}\n   Price: ${c.price}\n   Specs: ${specs}\n   Location: ${c.location}\n   Link: ${c.link}`;
  }).join('\n\n');

  return `${listings}\n\nView more on:\n• AutoScout24: ${searchUrl}\n• Mobile.de: ${mobileUrl}`;
}
