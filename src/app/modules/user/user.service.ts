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

export const UserServices = { addUserIntoDB, getUserFriends };
