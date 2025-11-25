import { Schema, model, Document, Types } from 'mongoose';

export interface IChat extends Document {
  userId: Types.ObjectId;
  title?: string;
  messages: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by user
chatSchema.index({ userId: 1, createdAt: -1 });

export default model<IChat>('Chat', chatSchema);

