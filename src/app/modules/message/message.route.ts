// routes/chat.route.ts
import express from 'express';
import { getMessages, sendMessage } from './message.controller';

const router = express.Router();

router.post('/', sendMessage);
router.get('/', getMessages);

export const MessageRoutes = router;
