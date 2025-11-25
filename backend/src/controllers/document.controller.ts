import { Response, NextFunction } from 'express';
import Document from '../models/Document';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { extractTextFromFile } from '../services/file.service';
import { ValidationError, NotFoundError, UnauthorizedError } from '../utils/errors';

const sanitizeFilename = (name: string) =>
  name
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.\-_]/g, '');

export const uploadDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }

    const { text, fileType } = await extractTextFromFile(req.file);

    const document = await Document.create({
      filename: `${Date.now()}-${sanitizeFilename(req.file.originalname)}`,
      originalName: req.file.originalname,
      fileType,
      fileSize: req.file.size,
      content: text,
      chunkCount: 0,
      uploadedBy: req.user.id,
      uploadedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const documents = await Document.find().sort({ uploadedAt: -1 }).select('-content');

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

