"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
// socket.ts
const socket_io_1 = require("socket.io");
const message_model_1 = require("../modules/message/message.model");
let io;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        socket.on('send-message', ({ from, to, content }) => __awaiter(void 0, void 0, void 0, function* () {
            io.to(to).emit('receive-message', {
                from,
                to,
                content,
                createdAt: new Date(),
            });
            const savedMsg = yield message_model_1.Message.create({
                from,
                to,
                content,
            });
            io.to(from).emit('message-delivered', {
                messageId: savedMsg._id,
            });
        }));
        socket.on('mark-as-read', ({ messageIds }) => __awaiter(void 0, void 0, void 0, function* () {
            yield message_model_1.Message.updateMany({ _id: { $in: messageIds } }, { $set: { read: true } });
        }));
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
