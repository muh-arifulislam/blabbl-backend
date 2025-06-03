"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
    },
    summary: {
        type: String,
    },
    category: {
        type: String,
    },
    featuredImage: {
        type: String,
    },
    mainContent: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: [
        {
            type: String,
        },
    ],
    tags: [
        {
            type: String,
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
});
exports.Blog = (0, mongoose_1.model)('Blog', blogSchema);
