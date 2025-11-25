import { Schema, model, Document, Types } from 'mongoose';

export type DocumentFileType = 'pdf' | 'docx' | 'txt';

export interface IDocument extends Document {
  filename: string;
  originalName: string;
  fileType: DocumentFileType;
  fileSize: number;
  content: string;
  chunkCount: number;
  astraDocumentId?: string;
  uploadedBy: Types.ObjectId;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx', 'txt'],
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 0,
    },
    content: {
      type: String,
      required: true,
    },
    chunkCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    astraDocumentId: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
documentSchema.index({ uploadedBy: 1, uploadedAt: -1 });
documentSchema.index({ fileType: 1 });

export default model<IDocument>('Document', documentSchema);

