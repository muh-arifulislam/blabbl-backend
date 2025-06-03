// controllers/chat.controller.ts
import { Request, Response } from 'express';
import { Message } from './message.model';

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { from, to, content } = req.body;
    const message = await Message.create({ from, to, content });

    return res.status(201).json({ message });
  } catch {
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.query;
    if (!user1 || !user2)
      return res.status(400).json({ error: 'Missing query params' });

    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch {
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
