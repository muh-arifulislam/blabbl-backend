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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const syncUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_service_1.UserServices.addUserIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Synced Successfully',
        data: null,
    });
}));
const getUserFriends = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth0Id = req.auth.sub;
    const result = yield user_service_1.UserServices.getUserFriends(userAuth0Id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Friends fetched successfully',
        data: result,
    });
}));
const getRecipient = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserServices.getUserByAuth0Id(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Recipient fetched successfully',
        data: result,
    });
}));
const searchUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = req.query;
    const userAuth0Id = req.auth.sub;
    const result = yield user_service_1.UserServices.searchUsers(searchTerm, userAuth0Id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Users fetched successfully',
        data: result,
    });
}));
const getUserFriendRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth0Id = req.auth.sub;
    const result = yield user_service_1.UserServices.getUserFriendRequestsFromDB(userAuth0Id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'User friend requests fetched successfully',
        data: result,
    });
}));
const sentFriendRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const senderAuth0Id = req.auth.sub;
    const receiverAuth0Id = req.params.id;
    const result = yield user_service_1.UserServices.sendFriendRequest(senderAuth0Id, receiverAuth0Id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Friend request sent successfully',
        data: result,
    });
}));
const acceptFriendRequestController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const receiverAuth0Id = req.auth.sub; // Auth0 user ID from decoded token
    const senderAuth0Id = req.params.id;
    const result = yield user_service_1.UserServices.acceptFriendRequest(receiverAuth0Id, senderAuth0Id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Friend request has been accepted successfully',
        data: result,
    });
}));
const deleteFriendRequestController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const receiverAuth0Id = req.auth.sub; // Auth0 user ID from decoded token
    const senderAuth0Id = req.params.id;
    const result = yield user_service_1.UserServices.deleteFriendRequest(receiverAuth0Id, senderAuth0Id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Friend request has been canceled.',
        data: result,
    });
}));
const unFriendUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth0Id = req.auth.sub;
    const friendAuth0Id = req.params.id;
    const result = yield user_service_1.UserServices.unFriendFromDB(userAuth0Id, friendAuth0Id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'User has been unfriended successfully',
        data: result,
    });
}));
const cancelFriendRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const senderAuth0Id = req.auth.sub;
    const receiverAuth0Id = req.params.id;
    const result = yield user_service_1.UserServices.cancelFriendRequest(senderAuth0Id, receiverAuth0Id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: 'Friend request has been canceled successfully',
        data: result,
    });
}));
exports.UserControllers = {
    syncUser,
    getUserFriends,
    getRecipient,
    searchUsers,
    sentFriendRequest,
    acceptFriendRequestController,
    deleteFriendRequestController,
    getUserFriendRequests,
    unFriendUser,
    cancelFriendRequest,
};
