import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { startSession } from 'mongoose';

const addUserIntoDB = async (payload: IUser) => {
  const user = await User.findOne({ auth0_id: payload.auth0_id });

  if (user) {
    throw new Error('User already exists');
  }

  const result = await User.create(payload);

  return result;
};

const getUserFriends = async (userAuth0Id: string) => {
  const user = await User.findOne({ auth0_id: userAuth0Id });
  if (!user) {
    throw new Error('User not exists');
  }

  await user.populate('friends');

  return user.friends;
};

const getUserByAuth0Id = async (auth0_id: string) => {
  const user = await User.findOne({
    auth0_id,
  }).select('name email auth0_id picture _id');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const searchUsers = async (searchTerm: string, auth0_id: string) => {
  const user = await User.findOne({ auth0_id });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const otherUsers = await User.find({
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
};

const sendFriendRequest = async (
  senderAuth0Id: string,
  receiverAuth0Id: string,
) => {
  const session = await startSession();
  try {
    session.startTransaction();

    const sender = await User.findOne({ auth0_id: senderAuth0Id }).session(
      session,
    );
    if (!sender) {
      throw new AppError(httpStatus.NOT_FOUND, 'Sender not found');
    }

    if (sender.auth0_id === receiverAuth0Id) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You cannot send a request to yourself',
      );
    }

    const receiver = await User.findOne({ auth0_id: receiverAuth0Id }).session(
      session,
    );

    if (!receiver) {
      throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');
    }

    // Already friends?
    if (
      sender.friends.includes(receiver._id) ||
      receiver.friends.includes(sender._id)
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You are already friends');
    }

    // Already requested?
    if (
      sender.friendRequests.sent.includes(receiver._id) ||
      receiver.friendRequests.received.includes(sender._id)
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Friend request already sent');
    }

    // Add to both sent and received arrays
    sender.friendRequests.sent.push(receiver._id);
    receiver.friendRequests.received.push(sender._id);

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { message: 'Friend request sent successfully' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelFriendRequest = async (
  senderAuth0Id: string,
  receiverAuth0Id: string,
) => {
  const session = await startSession();

  try {
    session.startTransaction();

    // Find sender by auth0_id
    const sender = await User.findOne({ auth0_id: senderAuth0Id }).session(
      session,
    );
    if (!sender) throw new AppError(httpStatus.NOT_FOUND, 'Sender not found');

    // Find receiver by _id
    const receiver = await User.findOne({ auth0_id: receiverAuth0Id }).session(
      session,
    );
    if (!receiver)
      throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');

    // Ensure request exists (sender sent to receiver)
    if (
      !sender.friendRequests.sent.includes(receiver._id) ||
      !receiver.friendRequests.received.includes(sender._id)
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Friend request not found');
    }

    // Remove from request lists
    sender.friendRequests.sent = sender.friendRequests.sent.filter(
      (id) => id.toString() !== receiver._id.toString(),
    );
    receiver.friendRequests.received = receiver.friendRequests.received.filter(
      (id) => id.toString() !== sender._id.toString(),
    );

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();
    session.endSession();

    return null;
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const acceptFriendRequest = async (
  receiverAuth0Id: string,
  senderAuth0Id: string,
) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const receiver = await User.findOne({ auth0_id: receiverAuth0Id }).session(
      session,
    );
    if (!receiver)
      throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');

    const sender = await User.findOne({ auth0_id: senderAuth0Id }).session(
      session,
    );
    if (!sender) throw new AppError(httpStatus.NOT_FOUND, 'Sender not found');

    // Ensure request exists
    if (
      !receiver.friendRequests.received.includes(sender._id) ||
      !sender.friendRequests.sent.includes(receiver._id)
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Friend request not found');
    }

    // Add each other as friends
    receiver.friends.push(sender._id);
    sender.friends.push(receiver._id);

    // Remove from request lists
    receiver.friendRequests.received = receiver.friendRequests.received.filter(
      (id) => id.toString() !== sender._id.toString(),
    );
    sender.friendRequests.sent = sender.friendRequests.sent.filter(
      (id) => id.toString() !== receiver._id.toString(),
    );

    await receiver.save({ session });
    await sender.save({ session });

    await session.commitTransaction();
    session.endSession();

    return null;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const deleteFriendRequest = async (
  receiverAuth0Id: string,
  senderAuth0Id: string,
) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const receiver = await User.findOne({ auth0_id: receiverAuth0Id }).session(
      session,
    );
    if (!receiver)
      throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');

    const sender = await User.findOne({ auth0_id: senderAuth0Id }).session(
      session,
    );
    if (!sender) throw new AppError(httpStatus.NOT_FOUND, 'Sender not found');

    // Ensure request exists
    if (
      !receiver.friendRequests.received.includes(sender._id) ||
      !sender.friendRequests.sent.includes(receiver._id)
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Friend request not found');
    }

    // Remove from request lists
    receiver.friendRequests.received = receiver.friendRequests.received.filter(
      (id) => id.toString() !== sender._id.toString(),
    );
    sender.friendRequests.sent = sender.friendRequests.sent.filter(
      (id) => id.toString() !== receiver._id.toString(),
    );

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();
    session.endSession();

    return null;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getUserFriendRequestsFromDB = async (auth0_id: string) => {
  const user = await User.findOne({ auth0_id });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  await user.populate('friendRequests.sent friendRequests.received');

  return {
    sent: user.friendRequests.sent,
    received: user.friendRequests.received,
  };
};

const unFriendFromDB = async (userAuth0Id: string, friendAuth0Id: string) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const user = await User.findOne({ auth0_id: userAuth0Id }).session(session);
    if (!user) throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');

    const friend = await User.findOne({ auth0_id: friendAuth0Id }).session(
      session,
    );
    if (!friend) throw new AppError(httpStatus.NOT_FOUND, 'Sender not found');

    if (
      !user.friends.includes(friend._id) ||
      !friend.friends.includes(user._id)
    ) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Users are not friends');
    }

    // Remove each other from friends list
    user.friends = user.friends.filter(
      (id) => id.toString() !== friend._id.toString(),
    );
    friend.friends = friend.friends.filter(
      (id) => id.toString() !== user._id.toString(),
    );

    await user.save({ session });
    await friend.save({ session });

    await session.commitTransaction();
    session.endSession();

    return null;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const UserServices = {
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
