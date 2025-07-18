# Project Structure

```
android-kernel-customizer/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Route-based page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility libraries
│   └── index.html
├── server/                   # Express.js backend
│   ├── services/           # Business logic services
│   ├── db.ts              # Database configuration
│   ├── storage.ts         # Data storage interface
│   ├── routes.ts          # API route definitions
│   └── replitAuth.ts      # Authentication middleware
├── shared/                  # Shared TypeScript types and schemas
│   └── schema.ts           # Drizzle database schema
├── docs/                   # Project documentation
│   ├── development/        # Development guides and checklists
│   ├── guides/            # User guides and wiki content
│   ├── assets/            # Images and documentation assets
│   └── README.md
├── tools/                  # Build tools and utilities
│   ├── kernel_customizer.py  # Main kernel build script
│   └── README.md
├── README.md              # Main project documentation
├── LICENSE               # MIT license
├── package.json          # Node.js dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite build configuration
├── drizzle.config.ts     # Database configuration
└── replit.md            # Project status and preferences
```

## Key Directories

- **client/** - Frontend React application with NetHunter theme
- **server/** - Backend API with authentication and database
- **shared/** - Type definitions shared between frontend and backend
- **docs/** - Comprehensive project documentation
- **tools/** - Python kernel build scripts and utilities

## Configuration Files

- **package.json** - Node.js project configuration and dependencies
- **tsconfig.json** - TypeScript compiler settings
- **tailwind.config.ts** - UI styling configuration
- **vite.config.ts** - Build system configuration
- **drizzle.config.ts** - Database ORM configuration