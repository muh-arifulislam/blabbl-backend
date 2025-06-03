"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({ required_error: 'email is required.' })
            .email('Please! enter a valid email.'),
        password: zod_1.z.string({
            required_error: 'Password is required.',
            invalid_type_error: 'Invalid type. Please enter a string',
        }),
    }),
});
exports.UserValidation = {
    createUserValidationSchema,
};
