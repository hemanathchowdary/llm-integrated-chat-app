import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EnvConfig {
  // Server
  port: number;
  nodeEnv: string;
  
  // MongoDB
  mongodbUri: string;
  
  // AstraDB
  astraDbEndpoint: string;
  astraDbToken: string;
  astraDbKeyspace: string;
  astraDbCollection: string;
  
  // JWT
  jwtSecret: string;
  jwtExpiresIn: string;
  
  // Groq
  groqApiKey: string;
  
  // HuggingFace
  huggingfaceApiKey: string;
  huggingfaceModel: string;
  
  // Embedding Config
  embeddingDimensions: number;
  chunkSize: number;
  chunkOverlap: number;
  
  // File Upload
  maxFileSize: number;
  uploadDir: string;
  
  // CORS
  frontendUrl: string;
}

function getEnvVar(key: string, defaultValue?: string, required: boolean = true): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    if (required) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return '';
  }
  return value || defaultValue || '';
}

export const env: EnvConfig = {
  // Server
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  
  // MongoDB
  mongodbUri: getEnvVar('MONGODB_URI', '', false), // Optional for initial setup
  
  // AstraDB
  astraDbEndpoint: getEnvVar('ASTRA_DB_ENDPOINT', '', false), // Optional for initial setup
  astraDbToken: getEnvVar('ASTRA_DB_APPLICATION_TOKEN', '', false), // Optional for initial setup
  astraDbKeyspace: getEnvVar('ASTRA_DB_KEYSPACE', 'support_chat_db', false),
  astraDbCollection: getEnvVar('ASTRA_DB_COLLECTION', 'document_chunks', false),
  
  // JWT
  jwtSecret: getEnvVar('JWT_SECRET', 'dev-secret-change-in-production', false), // Has default for dev
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
  
  // Groq
  groqApiKey: getEnvVar('GROQ_API_KEY', '', false), // Optional for initial setup
  
  // HuggingFace
  huggingfaceApiKey: getEnvVar('HUGGINGFACE_API_KEY', '', false), // Optional for initial setup
  huggingfaceModel: getEnvVar('HUGGINGFACE_MODEL', 'Alibaba-NLP/gte-large-en-v1.5'),
  
  // Embedding Config
  embeddingDimensions: parseInt(getEnvVar('EMBEDDING_DIMENSIONS', '1024'), 10),
  chunkSize: parseInt(getEnvVar('CHUNK_SIZE', '500'), 10),
  chunkOverlap: parseInt(getEnvVar('CHUNK_OVERLAP', '50'), 10),
  
  // File Upload
  maxFileSize: parseInt(getEnvVar('MAX_FILE_SIZE', '10485760'), 10),
  uploadDir: getEnvVar('UPLOAD_DIR', './uploads'),
  
  // CORS
  frontendUrl: getEnvVar('FRONTEND_URL', 'http://localhost:8080'),
};

