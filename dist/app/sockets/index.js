"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
// socket.ts
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
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
        socket.on('send-message', ({ from, to, content }) => {
            io.to(to).emit('receive-message', {
                from,
                to,
                content,
                createdAt: new Date(),
            });
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
exports.initSocket = initSocket;
