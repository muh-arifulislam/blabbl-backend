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
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const mongoose_1 = require("mongoose");
const addUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ auth0_id: payload.auth0_id });
    if (user) {
        throw new Error('User already exists');
    }
    const result = yield user_model_1.User.create(payload);
    return result;
});
const getUserFriends = (userAuth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ auth0_id: userAuth0Id });
    if (!user) {
        throw new Error('User not exists');
    }
    yield user.populate('friends');
    return user.friends;
});
const getUserByAuth0Id = (auth0_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({
        auth0_id,
    }).select('name email auth0_id picture _id');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return user;
});
const searchUsers = (searchTerm, auth0_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ auth0_id });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const otherUsers = yield user_model_1.User.find({
        $and: [
            {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { email: { $regex: searchTerm, $options: 'i' } },
                ],
            },
            { _id: { $ne: user._id } }, // exclude current user
            { friends: { $nin: [user._id.toString()] } }, // exclude users who already have this user as friend
        ],
    }).select('name email auth0_id picture _id friends');
    return otherUsers.length ? otherUsers : null;
});
const sendFriendRequest = (senderAuth0Id, receiverAuth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const sender = yield user_model_1.User.findOne({ auth0_id: senderAuth0Id }).session(session);
        if (!sender) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sender not found');
        }
        if (sender.auth0_id === receiverAuth0Id) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You cannot send a request to yourself');
        }
        const receiver = yield user_model_1.User.findOne({ auth0_id: receiverAuth0Id }).session(session);
        if (!receiver) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Receiver not found');
        }
        // Already friends?
        if (sender.friends.includes(receiver._id) ||
            receiver.friends.includes(sender._id)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You are already friends');
        }
        // Already requested?
        if (sender.friendRequests.sent.includes(receiver._id) ||
            receiver.friendRequests.received.includes(sender._id)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Friend request already sent');
        }
        // Add to both sent and received arrays
        sender.friendRequests.sent.push(receiver._id);
        receiver.friendRequests.received.push(sender._id);
        yield sender.save({ session });
        yield receiver.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return { message: 'Friend request sent successfully' };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelFriendRequest = (senderAuth0Id, receiverAuth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        // Find sender by auth0_id
        const sender = yield user_model_1.User.findOne({ auth0_id: senderAuth0Id }).session(session);
        if (!sender)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sender not found');
        // Find receiver by _id
        const receiver = yield user_model_1.User.findOne({ auth0_id: receiverAuth0Id }).session(session);
        if (!receiver)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Receiver not found');
        // Ensure request exists (sender sent to receiver)
        if (!sender.friendRequests.sent.includes(receiver._id) ||
            !receiver.friendRequests.received.includes(sender._id)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Friend request not found');
        }
        // Remove from request lists
        sender.friendRequests.sent = sender.friendRequests.sent.filter((id) => id.toString() !== receiver._id.toString());
        receiver.friendRequests.received = receiver.friendRequests.received.filter((id) => id.toString() !== sender._id.toString());
        yield sender.save({ session });
        yield receiver.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return null;
    }
    catch (err) {
        console.log(err);
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const acceptFriendRequest = (receiverAuth0Id, senderAuth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const receiver = yield user_model_1.User.findOne({ auth0_id: receiverAuth0Id }).session(session);
        if (!receiver)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Receiver not found');
        const sender = yield user_model_1.User.findOne({ auth0_id: senderAuth0Id }).session(session);
        if (!sender)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sender not found');
        // Ensure request exists
        if (!receiver.friendRequests.received.includes(sender._id) ||
            !sender.friendRequests.sent.includes(receiver._id)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Friend request not found');
        }
        // Add each other as friends
        receiver.friends.push(sender._id);
        sender.friends.push(receiver._id);
        // Remove from request lists
        receiver.friendRequests.received = receiver.friendRequests.received.filter((id) => id.toString() !== sender._id.toString());
        sender.friendRequests.sent = sender.friendRequests.sent.filter((id) => id.toString() !== receiver._id.toString());
        yield receiver.save({ session });
        yield sender.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return null;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const deleteFriendRequest = (receiverAuth0Id, senderAuth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const receiver = yield user_model_1.User.findOne({ auth0_id: receiverAuth0Id }).session(session);
        if (!receiver)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Receiver not found');
        const sender = yield user_model_1.User.findOne({ auth0_id: senderAuth0Id }).session(session);
        if (!sender)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sender not found');
        // Ensure request exists
        if (!receiver.friendRequests.received.includes(sender._id) ||
            !sender.friendRequests.sent.includes(receiver._id)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Friend request not found');
        }
        // Remove from request lists
        receiver.friendRequests.received = receiver.friendRequests.received.filter((id) => id.toString() !== sender._id.toString());
        sender.friendRequests.sent = sender.friendRequests.sent.filter((id) => id.toString() !== receiver._id.toString());
        yield sender.save({ session });
        yield receiver.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return null;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const getUserFriendRequestsFromDB = (auth0_id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ auth0_id });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    yield user.populate('friendRequests.sent friendRequests.received');
    return {
        sent: user.friendRequests.sent,
        received: user.friendRequests.received,
    };
});
const unFriendFromDB = (userAuth0Id, friendAuth0Id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const user = yield user_model_1.User.findOne({ auth0_id: userAuth0Id }).session(session);
        if (!user)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Receiver not found');
        const friend = yield user_model_1.User.findOne({ auth0_id: friendAuth0Id }).session(session);
        if (!friend)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sender not found');
        if (!user.friends.includes(friend._id) ||
            !friend.friends.includes(user._id)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Users are not friends');
        }
        // Remove each other from friends list
        user.friends = user.friends.filter((id) => id.toString() !== friend._id.toString());
        friend.friends = friend.friends.filter((id) => id.toString() !== user._id.toString());
        yield user.save({ session });
        yield friend.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return null;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
exports.UserServices = {
    addUserIntoDB,
    getUserFriends,
    getUserByAuth0Id,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    deleteFriendRequest,
    getUserFriendRequestsFromDB,
    unFriendFromDB,
    cancelFriendRequest,
};
