# 🚗 Road Trip Planner — Project Structure

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| State | Zustand |
| Styling | SCSS Modules |
| Deployment | Vercel |

---

## Folder Structure

```
road-trip-planner/
│
├── .env.local                        # API keys — never commit this
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout — loads globals.scss
│   ├── page.tsx                      # Home — shows TripForm or ItineraryView
│   ├── globals.scss                  # Global resets, CSS variables, typography
│   │
│   └── api/
│       └── itinerary/
│           └── route.ts              # POST — calls Claude, returns itinerary JSON
│
├── components/
│   ├── TripForm/
│   │   ├── TripForm.tsx              # Origin, destination, days, vibe inputs
│   │   └── TripForm.module.scss
│   │
│   ├── ItineraryView/
│   │   ├── ItineraryView.tsx         # Renders full trip — summary + day cards
│   │   └── ItineraryView.module.scss
│   │
│   ├── DayCard/
│   │   ├── DayCard.tsx               # One day — drive info + list of stops
│   │   └── DayCard.module.scss
│   │
│   ├── StopCard/
│   │   ├── StopCard.tsx              # Stop name, type, description, insider tip
│   │   └── StopCard.module.scss
│   │
│   └── LoadingState/
│       ├── LoadingState.tsx          # Animated placeholder while Claude generates
│       └── LoadingState.module.scss
│
├── store/
│   └── useTripStore.ts               # Zustand — formData, itinerary, isLoading, error
│
└── types/
    └── trip.ts                       # TypeScript interfaces — Trip, Day, Stop, StopType
```

---

## Data Flow

```
User fills TripForm
       ↓
page.tsx sends data → POST /api/itinerary/route.ts
       ↓
route.ts calls Claude API → receives JSON itinerary
       ↓
JSON stored in useTripStore (Zustand)
       ↓
page.tsx detects itinerary → switches to ItineraryView
       ↓
ItineraryView maps days → DayCard
DayCard maps stops → StopCard
```

---

## Key Types (`types/trip.ts`)

```typescript
StopType    → 'food' | 'attraction' | 'nature' | 'music' | 'rest' | 'fuel' | 'accommodation'
Stop        → name, type, description, tip, duration
Day         → day, title, from, to, miles, stops[], overnight
Itinerary   → origin, destination, totalDays, totalMiles, vibe, days[]
TripFormData → origin, destination, days, vibe
```

---

## Zustand Store (`store/useTripStore.ts`)

```typescript
formData    → what the user typed in TripForm
itinerary   → the generated itinerary from Claude
isLoading   → true while waiting for Claude response
error       → holds any error message string
reset()     → clears all state, returns to TripForm
```

---

## Build Order

- [x] Step 1 — `types/trip.ts` — Define data shapes
- [x] Step 2 — `store/useTripStore.ts` — Set up Zustand
- [x] Step 3 — `app/api/itinerary/route.ts` — Claude API connection
- [x] Step 4 — `TripForm` component — User input UI
- [x] Step 5 — `app/page.tsx` — Wire everything together
- [ ] Step 6 — `LoadingState` component
- [ ] Step 7 — `DayCard` + `StopCard` components
- [ ] Step 8 — `ItineraryView` component
- [ ] Step 9 — Final polish + deploy to Vercel

---

## Phase 2 (Post-MVP)
- 🗺️ Map integration (Mapbox or Google Maps)
- 🌤️ Weather per stop
- 💾 Save / share itinerary
- ⚡ Streaming responses for faster perceived load time