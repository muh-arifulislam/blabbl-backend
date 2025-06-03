import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IUser } from './user.interface';
import { User } from './user.model';

const addUserIntoDB = async (payload: IUser) => {
  const user = await User.findOne({ auth0_id: payload.auth0_id });

  if (user) {
    throw new Error('User already exists');
  }

  const result = await User.create(payload);

  return result;
};

const getUserFriends = async (userId: string) => {
  const user = await User.findOne({ auth0_id: userId });
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

export const UserServices = { addUserIntoDB, getUserFriends, getUserByAuth0Id };
