import Groq from 'groq-sdk';
import { env } from './env';

// Initialize Groq client only if API key is provided
export const groqClient = env.groqApiKey 
  ? new Groq({
      apiKey: env.groqApiKey,
    })
  : null;

// Default model configuration
export const GROQ_MODELS = {
  DEFAULT: 'openai/gpt-oss-120b',
  ALTERNATIVES: [
    'llama-3.1-70b-versatile',
    'mixtral-8x7b-32768',
    'gemma-7b-it',
  ],
} as const;

