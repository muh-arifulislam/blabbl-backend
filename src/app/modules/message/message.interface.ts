export interface IMessage extends Document {
  from: string;
  to: string;
  content: string;
  read: boolean;
  delivered: boolean;
  createdAt: Date;
  updatedAt: Date;
}
