"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
    delivered: { type: Boolean, default: false },
}, { timestamps: { createdAt: true } });
exports.Message = (0, mongoose_1.model)('Message', messageSchema);
