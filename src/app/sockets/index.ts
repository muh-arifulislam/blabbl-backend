// socket.ts
import { Server as SocketIOServer } from 'socket.io';
import { Message } from '../modules/message/message.model';

let io: SocketIOServer;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const initSocket = (server: any) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'https://blabbl.netlify.app',
        'http://192.168.56.1:5173',
      ],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('send-message', async ({ from, to, content }) => {
      io.to(to).emit('receive-message', {
        from,
        to,
        content,
        createdAt: new Date(),
      });

      const savedMsg = await Message.create({
        from,
        to,
        content,
      });

      io.to(from).emit('message-delivered', {
        messageId: savedMsg._id,
      });
    });

    socket.on('mark-as-read', async ({ messageIds }) => {
      await Message.updateMany(
        { _id: { $in: messageIds } },
        { $set: { read: true } },
      );
    });

    socket.on('typing', ({ from, to }) => {
      io.to(to).emit('typing', { from });
    });

    socket.on('stop-typing', ({ from, to }) => {
      io.to(to).emit('stop-typing', { from });
    });
  });

  return io;
};
