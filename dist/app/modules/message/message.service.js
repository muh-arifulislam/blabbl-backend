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
exports.MessageServices = void 0;
const message_model_1 = require("./message.model");
const getMessages = ({ from, to }) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield message_model_1.Message.find({
        $or: [
            { from, to },
            { from: to, to: from },
        ],
    }).sort({ createdAt: 1 });
    return messages;
});
exports.MessageServices = {
    getMessages,
};
