# Support Chat Backend API

Backend API for AI-powered customer support chat platform using Groq, MongoDB, AstraDB, and HuggingFace.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Databases**: 
  - MongoDB (relational data)
  - AstraDB (vector embeddings)
- **AI/LLM**: Groq API
- **Embeddings**: gte-large via HuggingFace Hub

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   - Copy `env.example` to `.env`
   - Fill in all required values (MongoDB URI, AstraDB credentials, API keys)

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Database models
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

See `env.example` for all required environment variables.

## API Endpoints

- `GET /health` - Health check endpoint

More endpoints will be added as implementation progresses.

## Development

- **Dev server**: `npm run dev` (uses nodemon for auto-reload)
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## Promote a User to Admin

Use the seed script to upgrade an existing user:

```bash
npm run promote-admin user@example.com
```

Requirements:

- `MONGODB_URI` must be configured in `.env`
- The user must already exist in the `users` collection
- Script exits early if the user is already an admin

## License

ISC

