import { HfInference } from '@huggingface/inference';
import { env } from './env';

// Initialize HuggingFace client only if API key is provided
export const huggingfaceClient = env.huggingfaceApiKey
  ? new HfInference(env.huggingfaceApiKey)
  : null;

export const HUGGINGFACE_MODEL = env.huggingfaceModel;

// Model configuration
export const EMBEDDING_CONFIG = {
  model: HUGGINGFACE_MODEL,
  dimensions: env.embeddingDimensions,
} as const;

