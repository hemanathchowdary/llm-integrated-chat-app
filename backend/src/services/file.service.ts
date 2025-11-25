import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { extname } from 'path';
import { AppError } from '../utils/errors';
import { DocumentFileType } from '../models/Document';

interface ParsedDocument {
  text: string;
  fileType: DocumentFileType;
}

const mimeTypeMap: Record<string, DocumentFileType> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
};

const extensionMap: Record<string, DocumentFileType> = {
  '.pdf': 'pdf',
  '.docx': 'docx',
  '.txt': 'txt',
};

const inferFileType = (file: Express.Multer.File): DocumentFileType => {
  if (mimeTypeMap[file.mimetype]) {
    return mimeTypeMap[file.mimetype];
  }

  const extension = extname(file.originalname).toLowerCase();

  if (extensionMap[extension]) {
    return extensionMap[extension];
  }

  throw new AppError('Unsupported file type', 400, 'INVALID_FILE_TYPE');
};

export const extractTextFromFile = async (file: Express.Multer.File): Promise<ParsedDocument> => {
  if (!file?.buffer) {
    throw new AppError('Invalid file buffer', 400, 'INVALID_FILE');
  }

  const fileType = inferFileType(file);
  let text = '';

  if (fileType === 'pdf') {
    const data = await pdfParse(file.buffer);
    text = data.text || '';
  } else if (fileType === 'docx') {
    const { value } = await mammoth.extractRawText({ buffer: file.buffer });
    text = value || '';
  } else {
    text = file.buffer.toString('utf-8');
  }

  const cleanedText = text.replace(/\s+/g, ' ').trim();

  if (!cleanedText) {
    throw new AppError('Could not extract text from the document', 400, 'EMPTY_DOCUMENT');
  }

  return {
    text: cleanedText,
    fileType,
  };
};

