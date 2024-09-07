import mongoose, { Document, Schema } from 'mongoose';

interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OTPSchema: Schema<IOTP> = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '0' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1m', // Automatically delete OTP after 10 minutes
  },
});

const OTP = mongoose.model<IOTP>('OTP', OTPSchema);

export default OTP;
