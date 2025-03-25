# Hearts and Paws

Hearts and Paws is a web application built with Next.js, TypeScript, and Tailwind CSS, designed to facilitate pet adoption, rehoming, and service provider dashboards. The project includes a robust API, reusable UI components, and a well-organized directory structure to ensure scalability and maintainability.

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Code Flow](#code-flow)
- [Setup and Installation](#setup-and-installation)
- [Contributing](#contributing)

## Project Overview
Hearts and Paws aims to connect pet owners, adopters, and service providers through a user-friendly platform. Key features include:
- Pet listing and adoption
- User registration and profile management
- Rehome and service provider dashboards
- Integration with Google Cloud Platform (GCP) for file uploads and deletions
- Responsive UI with reusable components

## Tech Stack
- **Framework**: Next.js (React Framework)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM
- **Linting**: ESLint
- **Build Tool**: Node.js, npm
- **CI/CD**: Jenkins (via `Jenkinsfile.dev`)
- **Other Tools**: PostCSS, middleware for request handling

## Directory Structure
The project follows a modular structure to keep the codebase organized and maintainable. Below is the directory hierarchy:

- **.next/**: Auto-generated directory by Next.js for build artifacts.
- **app/**: Main application directory for Next.js routing and pages.
  - **adapter-dash/**: Contains the core application logic and API routes.
    - **api/**: API routes for backend functionality.
      - **appointment/**: Handles appointment-related API endpoints.
      - **auth/**: Manages authentication logic.
      - **delete-gcp/**: API for deleting files from GCP.
      - **pets/**: Fetches pet-related data.
      - **service/**: Service-related endpoints.
      - **upload-gcp/**: API for uploading files to GCP.
      - **user-registration/**: Handles user registration.
      - **pet/**: Pet-related endpoints.
      - **pet-listing/**: Manages pet listing functionality.
      - **profile/**: User profile management.
      - **rehome-dashboard/**: Dashboard for rehoming pets.
      - **service-provider-dashboard/**: Dashboard for service providers.
    - **favicon.ico**: Favicon for the application.
    - **globals.css**: Global CSS styles using Tailwind CSS.
    - **layout.tsx**: Root layout component for the app.
    - **page.tsx**: Main page component.
  - **components/**: Reusable UI components.
    - **global/**: Global components used across the app.
      - **footer/**: Footer component.
      - **header/**: Header component.
      - **pet-profile/**: Pet profile component.
      - **static/**: Static UI elements.
      - **userProfile/**: User profile component.
    - **ui/**: Atomic UI components.
      - **alert.tsx**: Alert component for notifications.
      - **avatar.tsx**: Avatar component for user/pet images.
      - **button.tsx**: Reusable button component.
      - **filterSidebar.tsx**: Sidebar for filtering pet listings.
      - **input.tsx**: Input field component.
      - **petCard.tsx**: Card component for displaying pet details.
      - **petList.tsx**: Component for rendering a list of pets.
      - **textarea.tsx**: Textarea component for forms.
  - **constant/**: Constants and utility files.
    - **pet-profiles.tsx**: Constants for pet profiles.
    - **pets.tsx**: Constants for pet data.
    - **utils.tsx**: Utility functions.
  - **context/**: React context for state management.
  - **hooks/**: Custom React hooks.
  - **keys/**: API keys or other sensitive configurations (not committed).
  - **lib/**: Shared libraries or utilities.
  - **node_modules/**: Dependencies installed via npm.
  - **prisma/**: Prisma ORM configuration and schema.
  - **public/**: Static assets like images, fonts, etc.
- **.env**: Environment variables (e.g., API keys, database URLs).
- **.gitignore**: Files and directories to ignore in version control.
- **components.json**: Configuration for components (possibly for a component library).
- **eslint.config.mjs**: ESLint configuration for linting.
- **middleware.ts**: Middleware for handling requests in Next.js.
- **next-env.d.ts**: TypeScript definitions for Next.js.
- **next.config.ts**: Next.js configuration file.
- **package-lock.json**: Lock file for npm dependencies.
- **package.json**: Project metadata and dependencies.
- **postcss.config.mjs**: PostCSS configuration (used with Tailwind CSS).
- **README.md**: Project documentation (this file).
- **tailwind.config.ts**: Tailwind CSS configuration.
- **tsconfig.json**: TypeScript configuration.
- **Jenkinsfile.dev**: Jenkins pipeline configuration for CI/CD.

## Code Flow
1. **Entry Point**: The application starts with `app/layout.tsx` and `app/page.tsx`, which define the root layout and main page.
2. **Routing**: Next.js uses file-based routing. API routes are defined under `app/api/` (e.g., `pets/`, `profile/`), handling backend logic like fetching pet data or user registration.
3. **Components**: Reusable UI components are stored in `components/`. Global components (e.g., `header`, `footer`) are in `components/global/`, while atomic UI elements (e.g., `button`, `input`) are in `components/ui/`.
4. **State Management**: React context (`context/`) and custom hooks (`hooks/`) are used for state management across components.
5. **Data Fetching**: API routes interact with the database via Prisma (`prisma/`). For example, the `pets/` endpoint fetches pet data, which is then displayed using `petList.tsx` and `petCard.tsx`.
6. **Styling**: Tailwind CSS is used for styling, with global styles in `globals.css` and configuration in `tailwind.config.ts`.
7. **File Handling**: File uploads and deletions are managed via GCP, with endpoints like `upload-gcp/` and `delete-gcp/`.
8. **Constants and Utilities**: Constants (`constant/`) and utility functions (`constant/utils.tsx`) are used to avoid hardcoding values and to share logic across the app.

## Setup and Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd hearts-and-paws
