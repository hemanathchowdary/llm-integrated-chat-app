import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { generateChatCompletion } from '../services/ai.service';
import { ValidationError } from '../utils/errors';

export const sendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { message, systemPrompt, context, model, temperature, maxTokens, reasoningEffort } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      throw new ValidationError('Message is required');
    }

    const normalizedContext = Array.isArray(context)
      ? context
          .filter(
            (entry) =>
              entry &&
              typeof entry.content === 'string' &&
              entry.content.trim() &&
              ['system', 'user', 'assistant'].includes(entry.role)
          )
          .map((entry) => ({
            role: entry.role,
            content: entry.content.trim(),
          }))
      : undefined;

    const aiResponse = await generateChatCompletion({
      message,
      systemPrompt,
      context: normalizedContext,
      model,
      temperature,
      maxTokens,
      reasoningEffort,
    });

    res.status(200).json({
      success: true,
      data: {
        reply: aiResponse.text,
        model: aiResponse.model,
        usage: aiResponse.usage,
      },
    });
  } catch (error) {
    next(error);
  }
};

