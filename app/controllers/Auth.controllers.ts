import { tokenCache } from './../../node_modules/mongodb/src/client-side-encryption/providers/azure';
import  jwt  from 'jsonwebtoken';
import { Request, Response } from "express";
import User from "../models/User.model";
import { errorResponse, successResponse } from "../helpers/App.helper";
import bcrypt from "bcrypt";
import OTP from '../models/Otp.model';
import { sendOtpEmail } from '../helpers/sendEmail.helper';

export const signUp = async (req: Request, res: Response) => {
    try {
        const { name, email, password, token } = req.body;
        if (!name || !email || !password) {
           errorResponse(res, 'All fields are required', 400);
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return errorResponse(res, 'User already exists please login', 400);
        }
        // Check if token is valid
        if (!token || token === '') {
          return errorResponse(res, 'Invalid token', 400);
        }else{
          const decoded : any = jwt.verify(token, process.env.JWT_SECRET!);
          successResponse(res, 'User created successfully',decoded.email, 400);
          if (!decoded) {
            return errorResponse(res, 'Invalid token', 400);
          }else{
            
          }
        }
        // name valid 
        const nameRegex = /^[a-zA-Z\s]*$/;
        if (!nameRegex.test(name)) {
          return errorResponse(res, 'Invalid name', 400);
        }
        // check valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return errorResponse(res, 'Invalid email', 400);
        }
        // password valid
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        // if (!passwordRegex.test(password)) {
        //   return errorResponse(res, 'Invalid password', 400);
        // }
        // encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);
        

        // Create new user
        const user = new User({ name, email, password: encryptedPassword });
        await user.save();
        const authToken = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, { expiresIn: '15d' });
        successResponse(res, 'User created successfully', authToken, 201);
      } catch (err : Error | any) {
        return errorResponse(res, err.message, 500);
      }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
          return errorResponse(res, 'All fields are required', 400);
        }
        const user = await User.findOne({ email });
        if (!user) {
          return errorResponse(res, 'User not found', 404);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // 
        if (!isMatch) {
          return errorResponse(res, 'Invalid credentials', 401);
        }
        // create a token for the user
        const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);
        return successResponse(res, 'Login successful', { token });
      } catch (err : Error | any) {
        return errorResponse(res, err.message, 500);
      }
}

export const getOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
          return errorResponse(res, 'Email is required', 400);
        }
        // Check if otp already exists
        const otpExists = await OTP.findOne({ email, expiresAt: { $gt: Date.now() } });
        if (otpExists) {
          return errorResponse(res, 'OTP already sent please wait for 2 minutes', 400);
        }
    
        // send otp
        // const user = await User.findOne({ email });
        // if (!user) {
        //   return errorResponse(res, 'User not found', 404);
        // }
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        // create otp
        const otpData = new OTP({ email, otp, expiresAt: new Date(Date.now() + 2 * 60 * 1000) });
        await sendOtpEmail({ to: email, username: email, otpCode: otp.toString(), expiryTime: '2 minutes' });
        await otpData.save();
        // await sendEmail({ to: email, subject : 'OTP', text: `Your OTP is ${otp}` });
        // send mail
        return successResponse(res, 'OTP sent successfully', { otp });
      } catch (err : Error | any) {
        return errorResponse(res, err.message, 500);
      }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
          return errorResponse(res, 'Email and otp are required', 400);
        }
        const otpExists = await OTP.findOne({ email, otp, expiresAt: { $gt: Date.now() } });
        if (!otpExists) {
          return errorResponse(res, 'Invalid OTP', 400);
        }
        // delete otp
        await OTP.deleteOne({ email });
        // sned a token to the user
        const token = await jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '5m' });
        return successResponse(res, 'OTP verified successfully', { token });
      } catch (err : Error | any) {
        return errorResponse(res, err.message, 500);
      }
}
