import multer from 'multer';
import { extname } from 'path';
import { AppError } from '../utils/errors';
import { env } from '../config/env';

const allowedExtensions = ['.pdf', '.docx', '.txt'];
const allowedMimeTypes = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const extension = extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(extension) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new AppError('Unsupported file type. Only PDF, DOCX, and TXT are allowed.', 400, 'INVALID_FILE_TYPE'));
};

export const uploadDocumentMiddleware = multer({
  storage,
  limits: {
    fileSize: env.maxFileSize,
  },
  fileFilter,
}).single('file');

