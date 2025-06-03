import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    auth0_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    friendRequests: {
      sent: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      received: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const User = model<IUser>('User', userSchema);
