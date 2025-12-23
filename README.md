# FSM Admin Dashboard

A modern admin dashboard built with Vite, React, and TypeScript.

## Project Structure

```
fsm-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ColorPicker.tsx
│   │   ├── ContentCard.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── FormInput.tsx
│   │   └── StatBox.tsx
│   ├── pages/              # Page components
│   │   └── AdminDashboard.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useAdminDashboard.ts
│   ├── styles/             # CSS modules
│   │   ├── components/
│   │   ├── pages/
│   │   └── index.css
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

- ✅ Modern React 18 with TypeScript
- ✅ Vite for fast development and builds
- ✅ Component-based architecture
- ✅ Custom hooks for state management
- ✅ Responsive design
- ✅ Theme customization
- ✅ Feature module management
- ✅ Content management preview

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Run Express backend server

## Backend API

The backend Express server runs on port 3000 and can be started with:

```bash
npm run server
```

Vite dev server is configured to proxy API requests to the backend.
# fsm-dashboard
