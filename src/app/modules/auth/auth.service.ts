import httpStatus from 'http-status';

import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({
    email: payload.email,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // if (payload.password && user?.password) {
  //   const isPasswordMatched = await bcrypt.compare(
  //     payload.password,
  //     user.password,
  //   );

  //   if (!isPasswordMatched) {
  //     throw new AppError(httpStatus.FORBIDDEN, 'Password did not matched...!');
  //   }
  // }

  return { token: '' };
};

export const AuthServices = {
  loginUser,
};
