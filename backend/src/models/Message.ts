import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  text: string;
  isUser: boolean;
  timestamp: Date;
  metadata?: {
    tokensUsed?: number;
    model?: string;
    sources?: string[];
  };
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    isUser: {
      type: Boolean,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      tokensUsed: {
        type: Number,
      },
      model: {
        type: String,
      },
      sources: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by chat
messageSchema.index({ chatId: 1, timestamp: 1 });

export default model<IMessage>('Message', messageSchema);

