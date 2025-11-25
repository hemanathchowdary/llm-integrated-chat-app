import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { sendMessage } from '../controllers/chat.controller';

const router = Router();

router.post('/', authenticate, sendMessage);

export default router;

