# Chronicle

Chronicle is a clean time-tracking web app for counting down to future events and counting up from meaningful past moments.

It helps users track upcoming milestones, memories, deadlines, anniversaries, goals, and personal events in one simple dashboard.

## Features

* First-time user name capture
* Personalized dashboard greeting
* Create countdown events
* Create count-up memory events
* Automatically move expired countdowns into Memories
* Store events in LocalStorage
* Delete events with confirmation
* Sort upcoming events by soonest first
* Sort memories by newest first
* Category icons
* Progress indicators

  * Orange bars for upcoming events
  * Green completed bars for memories
* Form validation
* Responsive card-based layout
* Smooth UI animations with Framer Motion

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* date-fns
* lucide-react
* UUID
* LocalStorage

## Project Structure

```text
src/
├── components/
│   ├── AddEventButton.tsx
│   ├── AddEventModal.tsx
│   ├── DeleteConfirmModal.tsx
│   ├── EmptyState.tsx
│   ├── EventCard.tsx
│   ├── EventForm.tsx
│   └── EventSection.tsx
│
├── data/
│   └── demoEvents.ts
│
├── hooks/
│   ├── useEvents.ts
│   └── useLocalStorage.ts
│
├── pages/
│   └── Home.tsx
│
├── types/
│   └── Event.ts
│
├── utils/
│   ├── categories.ts
│   ├── date.ts
│   ├── eventFilters.ts
│   ├── eventStatus.ts
│   └── progress.ts
│
├── App.tsx
├── index.css
└── main.tsx
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/chronicle.git
cd chronicle
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app should be available at:

```text
http://localhost:5173/
```

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs linting checks.

## Event Types

Chronicle supports two main event types:

### Countdown

Used for future events.

Examples:

* Graduation
* Exams
* Birthdays
* Project deadlines
* World Cup matches

### Count Up

Used for past events and memories.

Examples:

* Started coding
* Relationship anniversary
* First GitHub commit
* Started university
* Personal milestones

## Event Categories

Current categories include:

* Birthday
* Relationship
* Education
* Coding
* Sports
* Holiday
* Goal
* Other

Each category has its own icon.

## Progress Logic

Chronicle uses event status to determine how progress should appear.

Upcoming countdowns display an orange remaining-time bar.

Completed events and memories display a full green progress bar with a completion badge.

Expired countdowns are automatically treated as memories.

## Roadmap

### Version 1

* Countdown events
* Count-up events
* LocalStorage persistence
* Event creation
* Event deletion
* Automatic completed-event handling
* Category icons
* Progress indicators

### Version 2

* Search and filtering
* Count view
* Calendar view
* Journey/timeline view
* Event editing
* Recurring event logic
* Import/export JSON
* Dark mode
* Better mobile polish

## Why This Project Exists

Chronicle started as a simple interactive countdown website, but the idea expanded into a personal time dashboard.

The goal is to build a small, useful, polished project while keeping the scope realistic enough to finish.

No overengineering. No backend too early. No unnecessary complexity.

Just a clean app that does one thing well: tracking meaningful time.

## License

This project is open source and available under the MIT License.
