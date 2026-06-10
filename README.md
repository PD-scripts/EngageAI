# Xeno CRM - Stage 1 (Foundation)

Welcome to **Xeno CRM**, an AI-Native Mini CRM designed specifically for customer engagement and marketing automation. This platform is tailored for consumer brands to import shopper data, build custom audiences, create marketing campaigns, and leverage AI to make optimal marketing decisions.

> [!NOTE]
> This is **Stage 1: Foundation**. It establishes the core project structure, frontend routing, layout architecture, and backend configuration needed to support subsequent stages (data import, segmentation, and AI copilot execution).

---

## Architecture Overview

Xeno CRM uses a decoupled client-server architecture:

```text
 project-root/
 ├── frontend/       # React (Vite) Single Page Application
 └── backend/        # Node.js + Express API server
```

### Stack
* **Frontend:** React, Vite, React Router v6, Tailwind CSS v4, Axios
* **Backend:** Node.js, Express, Cors, Dotenv
* **Database / Data Source:** Excel sheets (e.g., `Xeno_CRM_Dummy_Data.xlsx`)

---

## Folder Structure

The project has been organized with simplicity and interview readability in mind:

```text
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx      # Left navigation menu with active route highlighting
│   │   │   ├── Navbar.jsx       # Simple top header bar
│   │   │   └── Layout.jsx       # Page structure template (sidebar + navbar + content)
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # General campaign metrics placeholder
│   │   │   ├── Customers.jsx    # Shopper list placeholder (Stage 2)
│   │   │   └── AICopilot.jsx    # AI Audience builder placeholder (Stage 4)
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx    # Routing configurations using React Router
│   │   │
│   │   ├── App.jsx              # Wraps routes with BrowserRouter
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind CSS configurations & theme colors
│   │
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   └── server.js            # Express server entry point
│   │
│   ├── data/
│   │   └── Xeno_CRM_Dummy_Data.xlsx  # Generated Excel dummy data
│   │
│   └── package.json
│
└── README.md
```

---

## Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* `npm` (packaged with Node.js)

### 1. Clone & Navigate
Navigate to the root directory of the project:
```bash
cd crm2
```

### 2. Backend Setup
Navigate into the `backend` directory, install packages, and initialize:
```bash
cd backend
npm install
```

### 3. Frontend Setup
Navigate into the `frontend` directory and install packages:
```bash
cd ../frontend
npm install
```

---

## Running the Application

### Start the Backend Server
From the `backend` folder, run the following to start the Express server (runs on port `5000` by default):
```bash
npm run dev
```
Verify it is running by visiting [http://localhost:5000/](http://localhost:5000/). You should see:
```json
{
  "message": "Xeno CRM Backend Running"
}
```

### Start the Frontend Client
From the `frontend` folder, run the following to start the Vite development server:
```bash
npm run dev
```
Open the local server URL printed in the terminal (usually [http://localhost:5173/](http://localhost:5173/)) to access the CRM shell in your browser.

---

## Design Choices & Theme
The user interface implements a professional, clean theme designed for clarity:
* **Background:** `#f8fafc` (slate-50) for contrast with cards
* **Primary color:** `#2563eb` (blue-600) for active navigation and focal points
* **Cards:** `#ffffff` (white) with subtle borders
* **Borders:** `#e5e7eb` (slate-200) for clean dividing lines

---

## Future Stages (Roadmap)
* **Stage 2: Customer Data Import** - Implement parsing of `Xeno_CRM_Dummy_Data.xlsx` to render shopper tables.
* **Stage 3: Campaign Builder** - Add features to define target cohorts and draft marketing content.
* **Stage 4: AI Copilot Integration** - Integrate with Groq to allow marketers to speak to the CRM in plain English to build custom segments.
