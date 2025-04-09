
# Mediz - Healthcare Assistant App

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/            # Static assets and icons
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── features/      # Feature-specific components and logic
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utilities and API functions
│       ├── pages/         # Page components
│       └── App.tsx        # Root component
│
├── server/                # Backend Express server
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   └── index.ts         # Server entry point
│
├── shared/               # Shared code between client and server
│   └── schema.ts        # TypeScript interfaces/types
│
└── scripts/             # Build and utility scripts
```

## Key Features
- Prescription Translation
- Medication Management
- Medicine Information
- Reminders
