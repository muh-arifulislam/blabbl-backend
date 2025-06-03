import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const syncUser = catchAsync(async (req, res) => {
  await UserServices.addUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Synced Successfully',
    data: null,
  });
});

const getUserFriends = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await UserServices.getUserFriends(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Friends fetched successfully',
    data: result,
  });
});

const getRecipient = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.getUserByAuth0Id(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Recipient fetched successfully',
    data: result,
  });
});

export const UserControllers = { syncUser, getUserFriends, getRecipient };
