# Backend Architecture Plan - Customer Support Chat Platform

## Overview
Build a Node.js/Express backend API that powers an AI customer support chat platform using Groq (open-source LLM models), MongoDB for relational data storage, AstraDB for vector embeddings, and integrates with the existing React frontend.

---

## Technology Stack

### Core Technologies
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: 
  - **MongoDB** with Mongoose ODM (for users, chats, messages, FAQs metadata)
  - **AstraDB** (DataStax) for vector embeddings storage and similarity search
- **AI/LLM**: Groq API (OpenAI-compatible, supports open-source models like Llama, Mixtral, etc.)
- **Embeddings**: `gte-large` model via HuggingFace Hub API
  - Model: `Alibaba-NLP/gte-large-en-v1.5` (or similar)
  - Embedding dimensions: 1024
  - Access via HuggingFace Inference API
- **Authentication**: JWT (JSON Web Tokens) + bcrypt for password hashing
- **File Processing**: 
  - `pdf-parse` for PDF files
  - `mammoth` for Word documents (.docx)
  - Native text parsing for .txt files

### Development Tools
- **TypeScript**: Type safety
- **ESLint**: Code linting
- **dotenv**: Environment variables
- **cors**: Cross-origin resource sharing
- **multer**: File upload handling
- **express-validator**: Request validation

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # MongoDB connection
│   │   ├── astradb.ts           # AstraDB connection and client setup
│   │   ├── groq.ts               # Groq API client setup
│   │   ├── huggingface.ts       # HuggingFace API client setup
│   │   └── env.ts                # Environment variables validation
│   ├── models/
│   │   ├── User.ts               # User schema (email, password, role)
│   │   ├── Chat.ts               # Chat conversation schema
│   │   ├── Message.ts            # Individual message schema
│   │   ├── FAQ.ts                # FAQ schema
│   │   └── Document.ts           # Uploaded document schema
│   ├── controllers/
│   │   ├── auth.controller.ts    # Login, register, logout
│   │   ├── chat.controller.ts   # Send message, get chat history
│   │   ├── faq.controller.ts    # CRUD operations for FAQs
│   │   └── document.controller.ts # Upload, delete documents
│   ├── services/
│   │   ├── ai.service.ts         # Groq LLM integration
│   │   ├── embedding.service.ts  # Text embedding generation via HuggingFace (gte-large)
│   │   ├── knowledge.service.ts # RAG (Retrieval Augmented Generation) with AstraDB
│   │   └── file.service.ts       # File parsing (PDF, DOCX, TXT)
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── error.middleware.ts  # Error handling
│   │   ├── upload.middleware.ts  # File upload validation
│   │   └── validation.middleware.ts # Request validation
│   ├── routes/
│   │   ├── auth.routes.ts        # /api/auth/*
│   │   ├── chat.routes.ts        # /api/chat/*
│   │   ├── faq.routes.ts         # /api/faqs/*
│   │   └── document.routes.ts    # /api/documents/*
│   ├── utils/
│   │   ├── logger.ts             # Logging utility
│   │   ├── errors.ts             # Custom error classes
│   │   └── helpers.ts             # Helper functions
│   └── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Database Schema Design

### 1. User Model
```typescript
{
  _id: ObjectId
  email: string (unique, required)
  password: string (hashed, required)
  role: 'user' | 'admin' (default: 'user')
  createdAt: Date
  updatedAt: Date
}
```

### 2. Chat Model
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  title: string (optional, auto-generated from first message)
  messages: ObjectId[] (ref: Message)
  createdAt: Date
  updatedAt: Date
}
```

### 3. Message Model
```typescript
{
  _id: ObjectId
  chatId: ObjectId (ref: Chat)
  text: string (required)
  isUser: boolean (required)
  timestamp: Date (default: now)
  metadata: {
    tokensUsed?: number
    model?: string
    sources?: string[] (document IDs used in response)
  }
}
```

### 4. FAQ Model
```typescript
{
  _id: ObjectId
  question: string (required, indexed for search)
  answer: string (required)
  createdAt: Date
  updatedAt: Date
}
```

### 5. Document Model (MongoDB - Metadata Only)
```typescript
{
  _id: ObjectId
  filename: string (required)
  originalName: string (required)
  fileType: 'pdf' | 'docx' | 'txt' (required)
  fileSize: number (bytes)
  content: string (extracted text - for preview/search)
  chunkCount: number (number of chunks created)
  astraDocumentId: string (reference to AstraDB document)
  uploadedBy: ObjectId (ref: User)
  uploadedAt: Date
}
```

### 6. AstraDB Vector Collection Structure
```typescript
// Stored in AstraDB (not MongoDB)
{
  _id: string (UUID)
  documentId: string (reference to MongoDB Document._id)
  chunkIndex: number (position in document)
  text: string (chunk text content)
  embedding: number[1024] (gte-large embedding vector)
  metadata: {
    startIndex: number
    endIndex: number
    documentName: string
    fileType: string
  }
  createdAt: Date
}
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT)
- `POST /api/auth/logout` - Logout (client-side token removal)
- `GET /api/auth/me` - Get current user info

### Chat Routes (`/api/chat`)
- `GET /api/chat` - Get all chats for current user
- `POST /api/chat` - Create new chat
- `GET /api/chat/:chatId` - Get chat with messages
- `POST /api/chat/:chatId/message` - Send message and get AI response
- `DELETE /api/chat/:chatId` - Delete chat

### FAQ Routes (`/api/faqs`)
- `GET /api/faqs` - Get all FAQs (admin only)
- `POST /api/faqs` - Create FAQ (admin only)
- `PUT /api/faqs/:id` - Update FAQ (admin only)
- `DELETE /api/faqs/:id` - Delete FAQ (admin only)

### Document Routes (`/api/documents`)
- `GET /api/documents` - Get all uploaded documents (admin only)
- `POST /api/documents` - Upload document (admin only, multipart/form-data)
- `DELETE /api/documents/:id` - Delete document (admin only)

---

## Technology Details

### gte-large Embedding Model
- **Model**: `Alibaba-NLP/gte-large-en-v1.5` (or `Alibaba-NLP/gte-large-en-v1.5`)
- **Provider**: HuggingFace Hub
- **Embedding Dimensions**: 1024
- **Model Type**: Text embedding model trained with multi-stage contrastive learning
- **Use Case**: Semantic search, retrieval-augmented generation (RAG)
- **API Access**: HuggingFace Inference API
- **Model Card**: https://huggingface.co/Alibaba-NLP/gte-large-en-v1.5
- **Performance**: High-quality embeddings for English text, optimized for retrieval tasks
- **Input Format**: Text strings (sentences or paragraphs)
- **Output Format**: Array of 1024 floating-point numbers

### AstraDB (DataStax Astra DB)
- **Type**: Serverless vector database
- **Built On**: Apache Cassandra
- **Use Case**: Vector similarity search, storing and querying embeddings
- **Features**:
  - Native vector search with cosine similarity
  - REST API and TypeScript SDK
  - Automatic scaling
  - Multi-region support
  - Pay-as-you-go pricing
- **Collection Structure**: JSON documents with vector fields
- **Vector Search**: Built-in similarity search with configurable metrics
- **Setup**: Requires Astra DB account, database creation, and application token

### Dual Database Architecture
- **MongoDB**: 
  - Stores structured relational data
  - User accounts, authentication
  - Chat sessions and message history
  - FAQ metadata
  - Document metadata (filename, size, upload info)
- **AstraDB**:
  - Stores vector embeddings only
  - Document chunks with 1024-dim vectors
  - Optimized for similarity search
  - Fast retrieval for RAG context

---

## Core Features Implementation

### 1. Authentication & Authorization
- **Registration**: Hash password with bcrypt, store in MongoDB
- **Login**: Verify credentials, generate JWT token
- **JWT Middleware**: Protect routes, extract user info from token
- **Role-based Access**: Admin routes require admin role

### 2. AI Chat Integration (Groq)
- **Model Selection**: Use Groq's fast inference with models like:
  - `llama-3.1-70b-versatile` (recommended)
  - `mixtral-8x7b-32768`
  - `gemma-7b-it`
- **API Integration**: Use Groq SDK (OpenAI-compatible)
- **Streaming Support**: Optional streaming responses for better UX
- **Error Handling**: Graceful fallbacks if API fails

### 3. RAG (Retrieval Augmented Generation)
- **Document Processing**:
  1. Upload document → Extract text
  2. Split into chunks (500-1000 tokens each, with overlap)
  3. Generate embeddings for each chunk using `gte-large` via HuggingFace Hub
  4. Store document metadata in MongoDB
  5. Store chunks with 1024-dim embeddings in AstraDB vector collection
- **Query Processing**:
  1. User sends message
  2. Generate embedding for user query using `gte-large` via HuggingFace Hub
  3. Perform vector similarity search in AstraDB (cosine similarity)
  4. Retrieve top 3-5 relevant chunks from AstraDB
  5. Fetch full document metadata from MongoDB using documentId references
  6. Include chunks + FAQs in LLM context
  7. Generate response with citations using Groq

### 4. Knowledge Base Management
- **FAQ Management**: CRUD operations for FAQs
- **Document Upload**: Support PDF, DOCX, TXT
- **Text Extraction**: Parse different file formats
- **Chunking Strategy**: Smart chunking with overlap for context preservation

### 5. Chat History
- **Persistent Storage**: All messages stored in MongoDB
- **Chat Sessions**: Group messages by chat/conversation
- **Retrieval**: Load previous conversations for context

---

## Implementation Phases

### Phase 1: Foundation (Setup)
1. Initialize Node.js/TypeScript project
2. Setup Express server
3. Configure MongoDB connection
4. Configure AstraDB connection
5. Setup environment variables
6. Create base project structure

### Phase 2: Authentication
1. Create User model
2. Implement registration endpoint
3. Implement login endpoint with JWT
4. Create auth middleware
5. Test authentication flow

### Phase 3: Database Models
1. Create all Mongoose schemas
2. Setup relationships (references)
3. Add indexes for performance
4. Test model operations

### Phase 4: Groq AI Integration
1. Setup Groq API client
2. Create AI service for chat completion
3. Implement basic chat endpoint
4. Test AI responses

### Phase 5: File Processing
1. Setup file upload middleware (multer)
2. Implement PDF parsing
3. Implement DOCX parsing
4. Implement TXT parsing
5. Create document model and storage

### Phase 6: Embeddings & RAG
1. Setup HuggingFace API client for `gte-large` model
2. Implement embedding generation service using HuggingFace Inference API
3. Setup AstraDB connection and create vector collection
4. Implement chunking logic with overlap
5. Implement vector storage in AstraDB (1024-dim vectors)
6. Implement vector similarity search in AstraDB
7. Integrate RAG into chat flow (query → embedding → AstraDB search → context → Groq)

### Phase 7: FAQ Management
1. Create FAQ model
2. Implement FAQ CRUD endpoints
3. Integrate FAQs into RAG context
4. Test FAQ retrieval

### Phase 8: Chat History
1. Implement chat creation
2. Implement message storage
3. Implement chat retrieval
4. Add context from previous messages

### Phase 9: Admin Features
1. Add role-based access control
2. Protect admin routes
3. Implement document management
4. Test admin workflows

### Phase 10: Error Handling & Validation
1. Add request validation
2. Implement error middleware
3. Add logging
4. Test error scenarios

### Phase 11: Testing & Optimization
1. Test all endpoints
2. Optimize database queries
3. Add response caching if needed
4. Performance testing

---

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB (for relational data)
MONGODB_URI=mongodb://localhost:27017/support-chat
# or
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/support-chat

# AstraDB (for vector embeddings)
ASTRA_DB_ENDPOINT=https://your-database-id-your-region.apps.astra.datastax.com
ASTRA_DB_APPLICATION_TOKEN=your-astra-db-token
ASTRA_DB_KEYSPACE=your_keyspace_name
ASTRA_DB_COLLECTION=document_chunks

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Groq API (for LLM chat)
GROQ_API_KEY=your-groq-api-key

# HuggingFace API (for embeddings - gte-large)
HUGGINGFACE_API_KEY=your-huggingface-api-token
HUGGINGFACE_MODEL=Alibaba-NLP/gte-large-en-v1.5
# Alternative models:
# - BAAI/bge-large-en-v1.5
# - intfloat/e5-large-v2

# Embedding Configuration
EMBEDDING_DIMENSIONS=1024  # gte-large produces 1024-dim vectors
CHUNK_SIZE=500  # tokens per chunk
CHUNK_OVERLAP=50  # overlap tokens between chunks

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=./uploads

# CORS
FRONTEND_URL=http://localhost:8080
```

---

## Key Libraries & Packages

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "@datastax/astra-db-ts": "^1.0.0",
    "groq-sdk": "^0.3.0",
    "@huggingface/inference": "^2.6.4",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.6.0",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6",
    "@types/multer": "^1.4.11",
    "@types/pdf-parse": "^1.1.4",
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "eslint": "^8.55.0",
    "@typescript-eslint/parser": "^6.15.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0"
  }
}
```

---

## Security Considerations

1. **Password Hashing**: Use bcrypt with salt rounds (10+)
2. **JWT Security**: Use strong secret, set expiration
3. **Input Validation**: Validate all user inputs
4. **File Upload Security**: 
   - Validate file types
   - Limit file sizes
   - Sanitize filenames
   - Scan for malware (optional)
5. **CORS**: Configure properly for frontend domain
6. **Rate Limiting**: Add rate limiting for API endpoints
7. **Environment Variables**: Never commit secrets

---

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

---

## Next Steps

1. Review and approve this plan
2. Initialize backend project structure
3. Begin Phase 1 implementation
4. Set up development environment
5. Start building endpoints incrementally

---

## Notes

- **Groq**: Provides fast inference with open-source models (Llama, Mixtral, etc.)
- **gte-large Model**: 
  - Open-source embedding model from Alibaba DAMO Academy
  - Produces 1024-dimensional embeddings
  - Accessible via HuggingFace Inference API
  - Good performance for semantic search and RAG applications
  - Model card: https://huggingface.co/Alibaba-NLP/gte-large-en-v1.5
- **AstraDB**: 
  - Serverless vector database built on Apache Cassandra
  - Optimized for vector similarity search
  - Provides REST API and TypeScript SDK
  - Better performance than MongoDB for vector operations
  - Scales automatically
- **Dual Database Architecture**:
  - MongoDB: Stores structured data (users, chats, messages, FAQs, document metadata)
  - AstraDB: Stores vector embeddings for semantic search
  - Both databases work together for optimal performance
- **RAG Pipeline**: 
  - Documents → Chunks → gte-large embeddings → AstraDB storage
  - Queries → gte-large embedding → AstraDB similarity search → Context → Groq LLM
- Consider adding caching layer (Redis) for production
- Consider adding WebSocket for real-time chat (future enhancement)

