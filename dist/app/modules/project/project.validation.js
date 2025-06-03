"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidations = void 0;
const zod_1 = require("zod");
const addAdditionalMediaSchema = zod_1.z.object({
    url: zod_1.z.string().url({ message: 'Invalid URL format' }),
    title: zod_1.z.string().min(1, { message: 'Title is required' }),
    description: zod_1.z.string().optional(),
    thumbnail: zod_1.z.string().url({ message: 'Invalid thumbnail URL' }).optional(),
    order: zod_1.z.number().min(0, { message: 'Order must be a non-negative number' }),
});
const updateAdditionalMediaSchema = zod_1.z.object({
    url: zod_1.z.string().url({ message: 'Invalid URL format' }).optional(),
    title: zod_1.z.string().min(1, { message: 'Title is required' }).optional(),
    description: zod_1.z.string().optional(),
    thumbnail: zod_1.z.string().url({ message: 'Invalid thumbnail URL' }).optional(),
    order: zod_1.z
        .number()
        .min(0, { message: 'Order must be a non-negative number' })
        .optional(),
});
const addProjectDurationSchema = zod_1.z.object({
    from: zod_1.z
        .string()
        .regex(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/, "Date must be in 'MMM YYYY' format (e.g., Mar 2025)"),
    to: zod_1.z
        .string()
        .regex(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/, "Date must be in 'MMM YYYY' format (e.g., Mar 2025)"),
});
const updateProjectDurationSchema = zod_1.z.object({
    from: zod_1.z
        .string()
        .regex(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/, "Date must be in 'MMM YYYY' format (e.g., Mar 2025)")
        .optional(),
    to: zod_1.z
        .string()
        .regex(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/, "Date must be in 'MMM YYYY' format (e.g., Mar 2025)")
        .optional(),
});
const addOneValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: 'Title is required' }),
        description: zod_1.z.string().min(1, { message: 'Description is required' }),
        techStack: zod_1.z.array(zod_1.z.string().min(1, { message: 'Tech stack item cannot be empty' })),
        category: zod_1.z.string().min(1, { message: 'Category is required' }),
        image: zod_1.z.string().url({ message: 'Invalid image URL' }).optional(),
        additionalMedia: zod_1.z.array(addAdditionalMediaSchema),
        projectDuration: addProjectDurationSchema,
    }),
});
const updateOneValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(1, { message: 'Title is required' }).optional(),
        description: zod_1.z
            .string()
            .min(1, { message: 'Description is required' })
            .optional(),
        techStack: zod_1.z
            .array(zod_1.z.string().min(1, { message: 'Tech stack item cannot be empty' }))
            .optional(),
        category: zod_1.z
            .string()
            .min(1, { message: 'Category is required' })
            .optional(),
        image: zod_1.z
            .string()
            .url({ message: 'Invalid image URL' })
            .optional()
            .nullable(),
        additionalMedia: zod_1.z.array(updateAdditionalMediaSchema).optional(),
        projectDuration: updateProjectDurationSchema,
    })
        .partial(),
});
exports.ProjectValidations = {
    addOneValidationSchema,
    updateOneValidationSchema,
};
