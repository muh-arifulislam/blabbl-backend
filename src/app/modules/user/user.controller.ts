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
  const userAuth0Id = req.auth.sub;

  const result = await UserServices.getUserFriends(userAuth0Id);

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

const searchUsers = catchAsync(async (req, res) => {
  const { searchTerm } = req.query;

  const userAuth0Id = req.auth.sub;

  const result = await UserServices.searchUsers(
    searchTerm as string,
    userAuth0Id,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Users fetched successfully',
    data: result,
  });
});

const getUserFriendRequests = catchAsync(async (req, res) => {
  const userAuth0Id = req.auth.sub;

  const result = await UserServices.getUserFriendRequestsFromDB(userAuth0Id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User friend requests fetched successfully',
    data: result,
  });
});

const sentFriendRequest = catchAsync(async (req, res) => {
  const senderAuth0Id = req.auth.sub;
  const receiverAuth0Id = req.params.id;
  const result = await UserServices.sendFriendRequest(
    senderAuth0Id,
    receiverAuth0Id,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Friend request sent successfully',
    data: result,
  });
});

const acceptFriendRequestController = catchAsync(async (req, res) => {
  const receiverAuth0Id = req.auth.sub; // Auth0 user ID from decoded token
  const senderAuth0Id = req.params.id;

  const result = await UserServices.acceptFriendRequest(
    receiverAuth0Id,
    senderAuth0Id,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Friend request has been accepted successfully',
    data: result,
  });
});

const deleteFriendRequestController = catchAsync(async (req, res) => {
  const receiverAuth0Id = req.auth.sub; // Auth0 user ID from decoded token
  const senderAuth0Id = req.params.id;

  const result = await UserServices.deleteFriendRequest(
    receiverAuth0Id,
    senderAuth0Id,
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Friend request has been canceled.',
    data: result,
  });
});

const unFriendUser = catchAsync(async (req, res) => {
  const userAuth0Id = req.auth.sub;
  const friendAuth0Id = req.params.id;

  const result = await UserServices.unFriendFromDB(userAuth0Id, friendAuth0Id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User has been unfriended successfully',
    data: result,
  });
});

const cancelFriendRequest = catchAsync(async (req, res) => {
  const senderAuth0Id = req.auth.sub;
  const receiverAuth0Id = req.params.id;

  const result = await UserServices.cancelFriendRequest(
    senderAuth0Id,
    receiverAuth0Id,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Friend request has been canceled successfully',
    data: result,
  });
});

export const UserControllers = {
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
