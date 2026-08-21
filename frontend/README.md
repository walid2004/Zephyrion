# Zephyrion Frontend

The client-side interface for the Zephyrion automotive finding platform. Built with React 19, Vite, and Framer Motion.

---

## Features

- Real-time communication via Socket.IO client interface.
- Dynamic theme management supporting Light and Dark modes.
- Responsive layout constrained to single-page viewport dimensions.
- Client-side SPA routing for Home, About, Contact, and Documentation views.
- Context-aware quick action controls for search finalization, question skipping, filter summaries, and session resets.

---

## Development

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run ESLint validation
npm run lint

# Compile production bundle
npm run build
```

---

## Environment Variables

- `VITE_BACKEND_URL`: Optional URL of the backend service. If omitted, the client automatically defaults to `window.location.origin` in production and `http://localhost:4000` in development.
