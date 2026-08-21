# Zephyrion

Zephyrion is an intelligent automotive search platform and conversational assistant designed for the European and German used car market. The system integrates natural language understanding with real-time web scraping and query aggregation across leading automotive portals, including AutoScout24 and Mobile.de.

---

## Architecture Overview

The platform operates on a modular client-server architecture:

- **Frontend**: A single-page application built with React 19 and Vite, featuring Framer Motion animations, responsive theme switching (Light / Dark mode), client-side routing, and real-time Socket.IO bidirectional communication.
- **Backend**: A Node.js and Express server with Socket.IO orchestration, persistent session state management, natural language entity extraction, and automated marketplace scraping pipelines.

```
project2.0/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI/CD testing and build workflow
├── backend/
│   ├── public/                    # Production static build assets
│   ├── src/
│   │   ├── config/                # Server and environment configuration
│   │   ├── data/                  # Automotive taxonomies and dataset dictionaries
│   │   ├── engine/                # Conversational NLU and intent state machine
│   │   ├── services/              # Web scraping and marketplace query builders
│   │   ├── sockets/               # Socket.IO connection and event handlers
│   │   └── validators/            # Input validation and category matchers
│   ├── test/                      # Automated unit and integration test suites
│   └── server.js                  # Backend application entry point
├── frontend/
│   ├── src/
│   │   ├── components/            # Layout, chat interface, and informational pages
│   │   ├── context/               # Theme and application context providers
│   │   ├── hooks/                 # Custom React hooks (useChat, useTheme)
│   │   ├── services/              # Socket.IO client interface
│   │   └── styles/                # Global stylesheets and typography
│   ├── index.html
│   └── vite.config.js
└── package.json                   # Monorepo task orchestration scripts
```

---

## Conversational NLU Engine

The conversational engine allows users to interact in natural language without adhering to rigid linear forms.

### Intent Classification
Incoming messages are evaluated through a pattern-matching intent classifier:
- **FINISH**: Finalizes the search at any turn using current criteria and retrieves matching listings immediately.
- **SKIP**: Bypasses the current attribute question without applying a filter.
- **STATUS**: Outputs a structured summary of currently active filters.
- **RESTART**: Resets all collected filters, clears the conversation history, and restarts the session.
- **HELP**: Provides usage instructions and command syntax.
- **ANSWER**: Evaluates input for car specifications.

### Multi-Entity Extraction
The engine extracts multiple parameters simultaneously from single sentences. For example, a query such as:
> *"White Audi A4 Avant under 30k diesel with automatic transmission"*

Is parsed into structured criteria in a single execution step:
- **Make**: `audi`
- **Model**: `a4`
- **Body Style**: `kombi` (Station Wagon)
- **Max Price**: `€30,000`
- **Fuel Type**: `diesel`
- **Transmission**: `automatic_gear`

Attributes already detected are automatically omitted from subsequent question queues.

---

## Web Scraping and Marketplace Aggregation

Zephyrion queries German automotive marketplaces to fetch live inventory listings matching user parameters.

### Query Construction & Parameter Normalization
The query builder normalizes user inputs into marketplace-specific URL structures and query parameters:

- **AutoScout24 Germany (`autoscout24.de`)**:
  - **Make & Model URL Slugs**: Normalized paths (e.g. `/lst/bmw/3er`, `/lst/audi/a4`, `/lst/mercedes-benz/c-class`).
  - **Price Range**: `priceto` (maximum budget in EUR), `pricefrom` (minimum budget in EUR).
  - **First Registration Year**: `fregfrom` (minimum year), `fregto` (maximum year).
  - **Mileage Ceiling**: `kmto` (maximum odometer reading in kilometers).
  - **Power Output**: `powerfrom` (minimum horsepower converted to kilowatts).
  - **Transmission Mapping**: `gear=A` (Automatic / Dual-Clutch / CVT), `gear=M` (Manual).
  - **Fuel Categorization**: `fuel=B` (Petrol / Benzin), `fuel=D` (Diesel), `fuel=E` (Electric / BEV), `fuel=2` (Hybrid / PHEV).
  - **Body Style Codes**: Mapped to official numeric categories (`6` for SUV, `3` for Sedan/Limousine, `4` for Station Wagon/Kombi, `5` for Coupe, `2` for Convertible/Cabriolet, `1` for Compact/Hatchback, `7` for Van).
  - **Color Matrix**: Mapped to marketplace color codes (`10` for Black, `13` for White, `6` for Grey, `11` for Silver, `2` for Blue, `9` for Red, etc.).
  - **Door Configurations**: `doorfrom=4` or `doorto=3`.

- **Mobile.de (`suchen.mobile.de`)**:
  - Direct search query parameter synthesis (`maxPrice`, `minPrice`, `minFirstRegistrationDate`, `maxMileage`, `dam=false`).

### Extraction Pipeline
1. **HTTP Dispatch**: Requests are dispatched with randomized user agents, localized German header profiles (`Accept-Language: de-DE`), and request timeouts.
2. **HTML DOM Traversal**: Parsed using Cheerio to extract individual listing nodes (`<article>` elements).
3. **Field Extraction**:
   - **Vehicle Title & Trim**: Primary model identifiers combined with manufacturer trim badges.
   - **Price**: Extracted and normalized from dedicated price selectors.
   - **Technical Specifications**: Registration date (`MM/YYYY`), odometer reading (`km`), fuel classification, and engine power (`kW / PS`).
   - **Dealership Location**: Postal code and municipal location in Germany (e.g., `DE-81829 München`).
   - **Deep Links**: Direct URLs pointing to the vehicle listing for detailed inspection.
4. **Fallback & Broadening**: If strict criteria return zero direct matches, the system broadens peripheral filters and supplies direct aggregated search links.

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/walid2004/Zephyrion.git
cd Zephyrion

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Running Locally

#### Development Mode
Run both services concurrently:
```bash
# Start backend server on port 4000
npm run dev:backend

# In a separate terminal, start frontend dev server on port 5173
npm run dev:frontend
```

#### Production Mode
Build the frontend and run the unified server:
```bash
# Build frontend bundle and output to backend/public
npm run build:frontend
node backend/server.js
```
The application will be accessible at `http://localhost:4000`.

---

## Testing

Execute the automated test suites:
```bash
# Run backend validator and conversation engine tests
npm run test:backend

# Run frontend code linting
npm run lint:frontend
```

---

## CI/CD Pipeline

Continuous Integration is automated through GitHub Actions (`.github/workflows/ci.yml`):
- Triggers on all pushes and pull requests to `main` and `master`.
- Executes backend test suites.
- Validates frontend linting rules.
- Compiles the production build.

---

## Deployment

### Full-Stack on Render / Linux Server
1. Connect the GitHub repository to Render as a **Web Service**.
2. Set Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `node server.js`

### Frontend on Vercel
1. Connect the repository to Vercel.
2. Set Root Directory to `frontend`.
3. Set Framework Preset to `Vite`.
4. Add Environment Variable `VITE_BACKEND_URL` pointing to your deployed backend URL.

---

## Contact

- **Email**: lodaragab@gmail.com
- **GitHub**: [https://github.com/walid2004/Zephyrion](https://github.com/walid2004/Zephyrion)
- **Location**: Deggendorf, Germany
