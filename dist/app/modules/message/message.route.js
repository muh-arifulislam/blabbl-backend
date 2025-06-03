"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
// routes/chat.route.ts
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("./message.controller");
const router = express_1.default.Router();
router.post('/', message_controller_1.sendMessage);
router.get('/', message_controller_1.getMessages);
exports.MessageRoutes = router;
