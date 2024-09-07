import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../helpers/App.helper";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from "../models/User.model"; // Assuming User is your model
dotenv.config();

interface decodeTokent {
  _id: string;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any; // You can define the exact type if you know it
    }
  }
}

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as decodeTokent;
    if (!decoded) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    // Check if user exists in database
    const user = await User.findById(decoded._id); // Make sure to await this
    if (!user) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    // Attach the user object or user._id to the req object
    req.user = user; // If you just want the ID: req.user = user._id

    next();
  } catch (error) {
    return errorResponse(res, 'Unauthorized', 401);
  }
};
