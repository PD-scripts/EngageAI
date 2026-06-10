# AudiencePilot (Xeno CRM)

AudiencePilot is an AI-Native CRM and Marketing Automation Platform designed for consumer brands. It enables marketers to ingest shopper databases, dynamically query and segment customer lists, build audiences using natural language, and generate optimized multi-channel marketing campaigns using AI.

This project covers the full implementation of **Stages 1 through 5**.

---

## Core Features Implemented

### 📊 Stage 2: Excel Ingestion & Customer Views
- Automatically parses and caches customer lists and order history from Excel sheets (`Xeno_CRM_Dummy_Data.xlsx`) on server startup.
- Full API endpoints for customer profiles, search, filtering, and order lists.

### ⚙️ Stage 3: Dynamic JSON Query Engine
- Custom, type-aware filtering engine matching database fields (`TotalSpend`, `LastPurchaseDays`, `TotalOrders`, `City`, etc.) using strict logical `AND` query arrays.

### 🤖 Stage 4: AI Audience Builder
- Translates natural language requests (e.g., *"Find customers from Delhi who spent more than 10,000"*) into structured JSON query filters using Groq.
- Renders the resulting customer match list dynamically in the client dashboard.

### 🚀 Stage 5: AI Campaign Copilot (Latest)
- **Prompt-Based Campaign Strategy**: User describes the goal (e.g. *"Create a WhatsApp campaign for high-value customers to increase repeat purchases"*).
- **AI Parameter Extraction**: Auto-extracts target audience segments, communication channels (WhatsApp, Email, SMS), and goals directly from the prompt.
- **Privacy-Safe Stats Pipeline**: Pre-calculates aggregated audience metrics (customer count, average spend, average orders, top city) and passes *only* these metrics to the LLM (no emails, phone numbers, or raw customer records leave your server).
- **Circular Quality Score & Feedback**: AI generates a quality score (0-100) along with detailed strengths and recommended improvements.
- **MongoDB Persistence**: Full MongoDB database integration using Mongoose models to persist and manage campaign drafts.

---

## Technology Stack

- **Frontend**: React (Vite), React Router v6, Tailwind CSS v4, Axios
- **Backend**: Node.js, Express, Mongoose, Groq SDK, XLSX Reader, CORS, Dotenv
- **Database**: MongoDB (Mongoose Schema definition) & Excel sheet cache

---

## Folder Structure

```text
AudiencePilot/
│
├── frontend/                     # React (Vite SPA Client)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx       # Left navigation with active route highlights
│   │   │   ├── Navbar.jsx        # Top welcome header
│   │   │   └── Layout.jsx        # Layout shell (Sidebar + Navbar + Content)
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # General campaign status summary
│   │   │   ├── Customers.jsx     # Shoppers database directory with search & filters
│   │   │   ├── CustomerDetails.jsx # Detailed profile view & order history
│   │   │   ├── Orders.jsx        # Orders log directory
│   │   │   ├── QueryTester.jsx   # Testing query engine conditions
│   │   │   ├── AICopilot.jsx     # AI Audience builder (Stage 4)
│   │   │   └── Campaigns.jsx     # AI Campaign Copilot & Editor (Stage 5)
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx     # Routing table configuration
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css             # Tailwind 4 configurations and custom colors
│   │
│   └── package.json
│
├── backend/                      # Express REST API Server
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── customerController.js # Handles customers listing, details, paging
│   │   │   ├── orderController.js    # Handles order logs
│   │   │   ├── queryController.js    # Direct query engine gateway
│   │   │   ├── aiController.js       # AI Audience Builder compiler
│   │   │   └── campaignController.js # MongoDB campaign planner & registry
│   │   │
│   │   ├── models/
│   │   │   └── Campaign.js       # Mongoose schema model for MongoDB
│   │   │
│   │   ├── routes/
│   │   │   ├── customerRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   ├── queryRoutes.js
│   │   │   ├── aiRoutes.js
│   │   │   └── campaignRoutes.js  # Campaign strategy endpoints
│   │   │
│   │   ├── services/
│   │   │   ├── excelParser.js    # Excel sheet parsing service
│   │   │   ├── queryEngine.js    # Stage 3 dynamic JSON logical filter engine
│   │   │   ├── aiService.js      # Groq NLP translation model
│   │   │   └── campaignAiService.js # Campaign strategy & copywriter model
│   │   │
│   │   ├── utils/
│   │   │   └── excelReader.js    # Helper wrapping xlsx parses
│   │   │
│   │   └── server.js             # Express server and DB connections
│   │
│   ├── data/
│   │   └── Xeno_CRM_Dummy_Data.xlsx # Ingested Excel source file
│   │
│   ├── .env                      # Local server configuration
│   └── package.json
│
└── .gitignore                    # Shared untracked file configurations
```

---

## Installation & Setup

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **MongoDB**: A running MongoDB instance (Local or MongoDB Atlas)
- **Groq API Key**: Get one from the [Groq Console](https://console.groq.com/)

### 2. Clone and Install Dependencies
Navigate into the root directory:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Configurations
Create a `.env` file inside the `backend` folder:
```env
PORT=5000
GROQ_API_KEY=YOUR_GROQ_API_KEY
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/audiencepilot?appName=CompleteCoding
```

---

## Running the Application

### Start the Backend API Server
From the `backend` folder:
```bash
npm run dev
```
On success, you will see logs confirming:
- Excel database parsed (e.g., `Loaded 200 customers...`)
- Server running on port `5000`
- MongoDB database connection established (`Connected to MongoDB`)

### Start the Frontend Client
From the `frontend` folder:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your web browser to access the AudiencePilot application.

---

## Interview Highlights (Development Philosophy)
- **Modular & Decoupled Design**: Clear boundaries between query engines, AI parsers, and data storage.
- **PII Leakage Prevention**: AI only receives aggregated statistics (count, spends, averages, locations) to build strategies. Shopper phone numbers, names, and emails are strictly processed locally on your server.
- **Zero Redux/Context Overkill**: Simple React hooks, functional components, and standard Axios requests are used for high readability, easy debugging, and simple interview explanations.
