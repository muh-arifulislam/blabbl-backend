// routes/chat.route.ts
import express from 'express';
import { MessageController } from './message.controller';

const router = express.Router();

router.get('/:from/:to', MessageController.getMessages);

export const MessageRoutes = router;
