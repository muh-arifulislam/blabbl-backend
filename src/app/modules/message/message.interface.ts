export interface IMessage extends Document {
  from: string;
  to: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
