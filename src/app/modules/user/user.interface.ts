import { Types } from 'mongoose';

export interface IUser extends Document {
  auth0_id: string; // From Auth0 (e.g., google-oauth2|12345)
  name: string;
  email: string;
  picture?: string;

  friends: Types.ObjectId[]; // Confirmed friends
  friendRequests: {
    sent: Types.ObjectId[]; // IDs of users this user sent requests to
    received: Types.ObjectId[]; // IDs of users who sent requests to this user
  };

  createdAt: Date;
  updatedAt: Date;
}
