import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface representing a document in MongoDB
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Define the User schema corresponding to the document interface
const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create and export the model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;

