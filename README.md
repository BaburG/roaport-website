# Roaport Website & Backend API

This repository contains the source code for the main Roaport web application, built with Next.js. It serves as a comprehensive, multi-faceted component of the Roaport ecosystem, providing:

1.  **Public-Facing Website**: A user-friendly interface for the public to view and track road hazard reports on an interactive map and in a filterable list.
2.  **Admin Dashboard**: A secure, role-based portal for municipal staff to manage the entire lifecycle of a report, from verification to resolution.
3.  **Backend API**: A robust set of API endpoints that power the public site, the admin dashboard, and the Roaport mobile application.

## Features

- **Internationalization (i18n)**: Fully localized content for English and Turkish using `next-intl`.
- **Interactive Map**: Displays all reported hazards using Mapbox GL JS, with pins showing details on click.
- **Report Viewing & Filtering**: A paginated, filterable table view of all submitted reports.
- **Secure Admin Panel**:
  - Protected by **NextAuth** with a **Keycloak** provider.
  - Role-Based Access Control (RBAC) ensures only users in the 'admin' group can log in.
  - Functionality to view, verify, reject, and update the status of reports.
- **API Endpoints**:
  - `api/posts`: Fetches reports with support for geospatial and status-based filtering.
  - `api/posts/user/[id]`: Fetches reports submitted by a specific user.
  - `api/mobile/auth/*`: Handles login and registration for the mobile app.
  - `api/verify`: Internal endpoint for the ML service to mark reports as verified.
  - `api/mobile/notification`: Manages user push notification tokens.
- **Push Notification Service**: Integrates with Expo's push notification service to send feedback to users when their report status changes.
- **Responsive UI**: Built with **Tailwind CSS** and **Shadcn/ui** for a modern, responsive experience on all devices.
- **Database Integration**: Uses **Prisma ORM** for type-safe interaction with the PostgreSQL database.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with a [Keycloak](https://www.keycloak.org/) provider
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Mapping**: [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- A running PostgreSQL database
- A configured Keycloak instance

### Environment Variables

Create a `.env.local` file in the root of the project by copying the `.env.example` file. Fill in the following variables:

```env
# PostgreSQL connection string
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DATABASE"

# Mapbox public token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=

# Keycloak credentials for NextAuth provider
NEXT_PUBLIC_KEYCLOAK_URL=
NEXT_PUBLIC_KEYCLOAK_REALM=
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_SECRET=

# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET= # Generate with: openssl rand -base64 32
```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/roaport-website.git
    cd roaport-website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    - Ensure your PostgreSQL database is running and the `DATABASE_URL` in your `.env.local` is correct.
    - Run Prisma migrations to create the database schema:
      ```bash
      npx prisma migrate dev
      ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

## Project Structure

- `src/app/api/`: Contains all backend API route handlers.
- `src/app/[locale]/`: Contains all public-facing pages, organized by locale.
- `src/app/admin/`: Contains all pages for the secure admin dashboard.
- `src/components/`: Shared React components used across the application.
- `src/lib/`: Contains utility functions, database logic (`prisma.ts`), and external service integrations.
- `src/messages/`: Contains JSON files for internationalization (`en.json`, `tr.json`).
- `prisma/`: Contains the Prisma schema (`schema.prisma`) and migration files.

## Deployment

This project is configured for seamless deployment on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the repository into your Vercel account.
3.  Configure the required environment variables in the Vercel project settings.
4.  Vercel will automatically build and deploy the application on every push to the `main` branch.
