import { groqClient, GROQ_MODELS } from '../config/groq';
import { AppError } from '../utils/errors';

type Role = 'system' | 'user' | 'assistant';

interface ContextMessage {
  role: Role;
  content: string;
}

type ReasoningEffort = 'low' | 'medium' | 'high';

interface GenerateChatOptions {
  message: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  context?: ContextMessage[];
  reasoningEffort?: ReasoningEffort;
}

interface ChatCompletionResult {
  text: string;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

const DEFAULT_SYSTEM_PROMPT =
  'You are SupportAI, a helpful customer support assistant. Provide concise, friendly responses and reference the knowledge base when relevant.';

export const generateChatCompletion = async ({
  message,
  systemPrompt,
  model = GROQ_MODELS.DEFAULT,
  temperature = 0.7,
  maxTokens = 8192,
  context = [],
  reasoningEffort,
}: GenerateChatOptions): Promise<ChatCompletionResult> => {
  if (!message?.trim()) {
    throw new AppError('Message is required', 400, 'MESSAGE_REQUIRED');
  }

  if (!groqClient) {
    throw new AppError('Groq API key is not configured', 500, 'GROQ_NOT_CONFIGURED');
  }

  const messages: { role: Role; content: string }[] = [
    {
      role: 'system',
      content: systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT,
    },
    ...context.filter((entry) => entry.content?.trim()),
    {
      role: 'user',
      content: message.trim(),
    },
  ];

  try {
    const completionPayload: Record<string, unknown> = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    if (reasoningEffort) {
      completionPayload.reasoning = {
        effort: reasoningEffort,
      };
    }

    const response = await groqClient.chat.completions.create(completionPayload as any);

    const reply = response.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      throw new AppError('Groq returned an empty response', 502, 'GROQ_EMPTY_RESPONSE');
    }

    return {
      text: reply,
      model: response.model || model,
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error instanceof Error ? error.message : 'Failed to generate chat completion',
      502,
      'GROQ_COMPLETION_ERROR'
    );
  }
};

