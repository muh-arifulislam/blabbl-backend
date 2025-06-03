import { Message } from './message.model';

const getMessages = async ({ from, to }: { from: string; to: string }) => {
  const messages = await Message.find({
    $or: [
      { from, to },
      { from: to, to: from },
    ],
  }).sort({ createdAt: 1 });

  return messages;
};

export const MessageServices = {
  getMessages,
};
