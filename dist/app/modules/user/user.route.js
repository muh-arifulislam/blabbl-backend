"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.post('/sync', user_controller_1.UserControllers.syncUser);
router.get('/:userId/friends', user_controller_1.UserControllers.getUserFriends);
router.get('/:id/recipient', user_controller_1.UserControllers.getRecipient);
exports.UserRoutes = router;
