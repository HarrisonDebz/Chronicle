# Chronicle

Chronicle is a clean, modern, and high-performance time-tracking web application for counting down to future milestones and counting up from meaningful past moments. 

Designed with premium dark aesthetics and glassmorphic micro-animations, Chronicle serves as a personal time dashboard. It offers secure user account management, automatic offline-first capabilities (PWA), real-time cloud synchronization, and smart local/background notifications.

---

## Key Features

### 🌟 Interactive Dashboard
- **Personalized Greeting**: Dynamic name capture and greeting tailored to the user profile.
- **Milestone Overview**: Quick view of active countdowns and memory counts.
- **Smart Transitions**: Expired countdown events are automatically transitioned to completed count-ups (Memories) dynamically.

### 📅 Multi-Dimensional Tracking Views
- **Dashboard**: Modern dashboard showing featured upcoming events and a chronological memory timeline.
- **Monthly Calendar**: A full interactive monthly calendar grid to visualize schedule distributions.
- **Anniversary Journey**: An interactive path tracing memory anniversaries over time.
- **Statistics & Analytics**: Comprehensive breakdowns of events by category, progress metrics, tracking patterns, and streaks.
- **Category Explorer**: Categorized organization (Birthday, Relationship, Education, Coding, Sports, Holiday, Goal, etc.) matching distinct icons.

### 🔒 User Accounts & Cloud Sync
- **Supabase Authentication**: Secure login and sign-up modal flow.
- **Cloud Sync**: Automatic cloud syncing of events and profile settings with local storage fallback when offline.
- **Manual Sync**: Direct sync triggering option in settings to pull/push the latest records.

### 🔔 Smart Notification Engine
- **iOS Compatibility**: Safe global `Notification` object wrappers preventing startup failures in browsers/tab-environments where Web Notifications are unsupported.
- **Countdown Alerts**: Push notifications sent leading up to countdowns (e.g. 15-min, 1-hour, 1-day before, or day of event) with dynamic remaining time phrasing.
- **Anniversary Rollovers**: Anniversary notifications persist for the entire day (suppressing rollovers to the next year until 11:59:59 PM) so users never miss an anniversary notification.
- **Background Checks**: Service Worker background check tasks supporting periodic sync triggers.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Vanilla CSS variables
- **Animations**: Framer Motion
- **Database / Auth**: Supabase JS Client SDK
- **Utilities**: date-fns (date computations), lucide-react (icons), uuid (event ID generation)
- **Offline / PWA**: Vite PWA Plugin, Workbox service worker caching

---

## Project Structure

```text
src/
├── assets/             # Images and icons
├── components/         # Reusable React components
│   ├── AddEventButton.tsx
│   ├── AddEventModal.tsx
│   ├── AppShell.tsx
│   ├── AuthModal.tsx
│   ├── CalendarDay.tsx
│   ├── CalendarEventList.tsx
│   ├── CalendarView.tsx
│   ├── CategoryIcon.tsx
│   ├── CategoryView.tsx
│   ├── DeleteConfirmModal.tsx
│   ├── EmptyState.tsx
│   ├── EventCard.tsx
│   ├── EventDetailsModal.tsx
│   ├── EventFilterBar.tsx
│   ├── EventForm.tsx
│   ├── EventSection.tsx
│   ├── FeaturedUpcomingCard.tsx
│   ├── FilteredEmptyState.tsx
│   ├── JourneyEventCard.tsx
│   ├── JourneyView.tsx
│   ├── MemoriesTimeline.tsx
│   ├── MemoryTimelineItem.tsx
│   ├── MobileBottomNav.tsx
│   ├── MobileHeader.tsx
│   ├── NamePromptModal.tsx
│   ├── ProfileSettingsModal.tsx
│   ├── Sidebar.tsx
│   ├── StatisticsView.tsx
│   ├── UpcomingMiniCard.tsx
│   └── UpcomingSection.tsx
│
├── config/             # Supabase client and application configuration
│   ├── app.ts
│   └── supabaseClient.ts
│
├── context/            # Global React Context providers (Theme, etc.)
│   └── ThemeContext.tsx
│
├── hooks/              # Custom React hooks
│   ├── useAuth.ts            # Supabase user session and profile hook
│   ├── useEvents.ts          # Core CRUD handling for local/remote events
│   ├── useNotifications.ts   # Safely-wrapped web push notification interface
│   ├── useNow.ts             # Tick timer for relative time updates
│   ├── useSync.ts            # Cloud sync synchronization logic
│   └── useToast.tsx          # Dynamic notification banner alerts
│
├── types/              # TypeScript typings
│   ├── Event.ts
│   ├── Filters.ts
│   └── Navigation.ts
│
├── utils/              # Calculation helpers and business logic
│   ├── calendar.ts
│   ├── categories.ts
│   ├── date.ts
│   ├── eventDisplay.ts
│   ├── eventFilters.ts
│   ├── eventSearch.ts
│   ├── eventStatus.ts
│   ├── journey.ts
│   ├── progress.ts
│   └── statistics.ts
│
├── App.tsx             # Main router and view resolver
├── index.css           # Styling system base & custom CSS theme variables
├── main.tsx            # Rendering entrypoint and providers wrapping
└── sw.ts               # Workbox-based service worker for PWA caching & background tasks
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/chronicle.git
cd chronicle
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your Supabase configuration:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start the development server
```bash
npm run dev
```
The app will be available locally at `http://localhost:5173/`.

---

## Available Scripts

### `npm run dev`
Starts the Vite dev server locally.

### `npm run build`
Bundles the React client environment and builds the service worker (`src/sw.ts`) in ES format for production.

### `npm run lint`
Runs ESLint audits across all TS, TSX, and JS files.

### `npm run preview`
Launches a preview server to test the production build locally.

---

## License

This project is licensed under the MIT License.
