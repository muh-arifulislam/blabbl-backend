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
exports.getMessages = exports.sendMessage = void 0;
const message_model_1 = require("./message.model");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, content } = req.body;
        const message = yield message_model_1.Message.create({ from, to, content });
        return res.status(201).json({ message });
    }
    catch (_a) {
        return res.status(500).json({ error: 'Failed to send message' });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user1, user2 } = req.query;
        if (!user1 || !user2)
            return res.status(400).json({ error: 'Missing query params' });
        const messages = yield message_model_1.Message.find({
            $or: [
                { from: user1, to: user2 },
                { from: user2, to: user1 },
            ],
        }).sort({ createdAt: 1 });
        return res.status(200).json({ messages });
    }
    catch (_b) {
        return res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
exports.getMessages = getMessages;
