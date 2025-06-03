"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const additionalMediumSchema = new mongoose_1.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    thumbnail: {
        type: String,
        default: null,
    },
    order: {
        type: Number,
        required: true,
    },
}, {
    versionKey: false,
});
const projectDurationSchema = new mongoose_1.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
}, {
    versionKey: false,
    _id: false,
});
const projectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    techStack: [
        {
            type: String,
        },
    ],
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    additionalMedia: [
        {
            type: additionalMediumSchema,
            required: true,
        },
    ],
    projectDuration: {
        type: projectDurationSchema,
        required: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
exports.Project = (0, mongoose_1.model)('Project', projectSchema);
