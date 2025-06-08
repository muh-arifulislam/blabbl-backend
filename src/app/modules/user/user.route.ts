import express from 'express';
import { UserControllers } from './user.controller';
import checkJwt from '../../middlewares/checkJWT';

const router = express.Router();

router.post('/sync', UserControllers.syncUser);

router.get('/friends', checkJwt, UserControllers.getUserFriends);

router.get('/:id/recipient', UserControllers.getRecipient);

router.get('/search', checkJwt, UserControllers.searchUsers);

router.post(
  '/:id/sent-friend-request',
  checkJwt,
  UserControllers.sentFriendRequest,
);

router.post(
  '/:id/accept-friend-request',
  checkJwt,
  UserControllers.acceptFriendRequestController,
);

router.post(
  '/:id/delete-friend-request',
  checkJwt,
  UserControllers.deleteFriendRequestController,
);

router.get(
  '/user-friend-requests',
  checkJwt,
  UserControllers.getUserFriendRequests,
);

router.post('/:id/unfriend', checkJwt, UserControllers.unFriendUser);

router.post(
  '/:id/cancel-friend-request',
  checkJwt,
  UserControllers.cancelFriendRequest,
);

export const UserRoutes = router;
