import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachment?: string;
}

interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema<IMessage>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  attachment: { type: String }
});

const ChatSchema: Schema = new Schema<IChat>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
