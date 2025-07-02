# NoxaSense – Real User Monitoring (RUM) Tool

NoxaSense is a Real User Monitoring (RUM) solution designed to track, measure, and optimize web application performance based on actual user experiences.

## Project Overview

NoxaSense is organized as a scalable, efficient mono-repo powered by Turborepo and consists of three core components:

 - **CDN**: JavaScript tracking snippet
 - **API**: Data processing and storage
 - **Dashboard**: User interface and analytics visualization

## Technology Stack

 - **Frontend & CDN Hosting**: Vercel
 - **Backend/API Hosting**: Vercel (Serverless Functions)
 - **Database & Authentication**: Supabase
 - **Mono-repo Management**: Turborepo

## Repository Structure

noxasense/
├── apps/
│   ├── cdn
│   ├── api
│   └── dashboard
├── packages/
│   └── shared (shared types, utilities)
├── docs/ (comprehensive developer documentation)
├── .github/ (CI/CD workflows)
├── cursor.json (AI development instructions)
├── README.md
└── package.json

## Getting Started

1. Clone Repository

```bash
git clone https://github.com/yourusername/noxasense.git
cd noxasense
```

2. Install Dependencies

```bash
npm run install:all
```

3. Run the Development Environment

```bash
npm run dev
```

This will start both the CDN server (HTTPS on port 3001) and the Dashboard (Next.js on port 3000) simultaneously.

### Individual Services

You can also run services individually:

```bash
# CDN only (HTTPS server on port 3001)
npm run dev:cdn

# Dashboard only (Next.js on port 3000)
npm run dev:dashboard
```

## Documentation

Detailed documentation for developers can be found in the docs directory.

## Contribution Guidelines

We welcome contributions! Please follow these steps:

1. Fork and clone the repository.

2. Create a new branch:

```bash
git checkout -b feature-branch-name
```

3. Make changes and update relevant documentation.

4. Submit a pull request describing your changes clearly.

Please ensure all code and documentation changes adhere to established guidelines.