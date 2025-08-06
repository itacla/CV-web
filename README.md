# Interactive CV Project

This is a project for an interactive CV web application, which allows you to display and manage your work experience, skills, and personal information.

## Features

*   **Profile Management:** View and manage personal information.
*   **Experience Management:** Add, edit, and delete work experiences, displayed in a timeline.
*   **Skills Management:** Add, edit, and delete skills, displayed in a tag cloud.
*   **User Management:** (Admin) Manage user access and roles.
*   **Admin Page:** A dedicated page for administrative tasks.
*   **Home Page:** The main page to display the CV.

## Technologies Used

*   **Frontend:**
    *   [React](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/)
    *   [React Router](https://reactrouter.com/)
    *   [React Bootstrap](https://react-bootstrap.github.io/)
    *   [React Chrono](https://github.com/prabhuignoto/react-chrono)
    *   [React Tagcloud](https://github.com/freyars/react-tagcloud)
*   **Backend & Database:**
    *   [Supabase](https://supabase.io/)

## Getting Started

### Prerequisites

Before you begin, ensure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/cv-project.git
    cd cv-project
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the project root and add your Supabase credentials.
    ```
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

### Available Scripts

*   `npm run dev`: Starts the application in development mode.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Lints the code.
*   `npm run preview`: Starts a preview server for the production build.

## React + Vite Documentation

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
