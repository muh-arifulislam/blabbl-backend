import express from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post('/sync', UserControllers.syncUser);

router.get('/:userId/friends', UserControllers.getUserFriends);

router.get('/:id/recipient', UserControllers.getRecipient);

export const UserRoutes = router;
