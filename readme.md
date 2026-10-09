# reverie

### *A thoughtful space for your thoughts.*

Reverie is an AI powered journaling application that helps users organize their notes and reflect on their thoughts through AI conversations.

**Tech Stack:** Node.js, Express, TypeScript, PostgreSQL, Prisma and Groq.

## Getting Started

### 1. Clone the repository

    git clone [https://github.com/gameotiw1209/reverie.git]
    cd reverie/backend
    npm install

### 2. Configure environment variables

Create a `.env` file inside `backend` and add your credentials.

    DATABASE_URL="your_database_url"
    JWT_SECRET="your_secret_key"
    GROQ_API_KEY="your_groq_api_key"
    NODE_ENV="development"

### 3. Initialize and run

    npx prisma generate
    npx prisma migrate dev
    npm run build
    npm start

The backend will run at `http://localhost:5000`.

## Deployment

**Backend:** https://reverie-ucpr.onrender.com

*The frontend is deployed separately on Vercel.*
