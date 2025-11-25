import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { uploadDocumentMiddleware } from '../middleware/upload.middleware';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/document.controller';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/', getDocuments);
router.post('/', uploadDocumentMiddleware, uploadDocument);
router.delete('/:id', deleteDocument);

export default router;

