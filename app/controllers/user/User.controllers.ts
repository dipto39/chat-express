import mongoose from 'mongoose';
import { Request, Response } from "express";
import Chat from "../../models/ChatRoom.model";
import { errorResponse, successResponse } from '../../helpers/App.helper';
import User from '../../models/User.model';



export const getContacts = async (req: Request, res: Response) => {
    try {
        const userId = req?.user?._id;
        const chats = await User.find({ _id: { $ne: userId } }).select('name email');
        successResponse(res, 'Contacts fetched successfully', chats, 200);
    } catch (error) {
        errorResponse(res, 'Failed to fetch contacts', 500);
    }
}
export const sendMessage = async (req: Request, res: Response) => {
    try {
        // Step 1: Check if a chat exists between sender and receiver
        const {receiverId,  message, attachment } = req.body;
        let chat = await Chat.findOne({
            participants: { $all: [req?.user?._id, receiverId] }
          });
        // Step 2: If no chat exists, create a new chat with both participants
        if (!chat) {
          chat = new Chat({
            participants: [req?.user?._id, receiverId],
            messages: [] // Initialize an empty messages array
          });
        }
    
        // Step 3: Create a new message object
        const newMessage : any = {
          _id: new mongoose.Types.ObjectId(),
          sender: {
            _id: req?.user?._id,
            name: req?.user?.name
          },
          content : message,
          timestamp: new Date(),
          isRead: false,
          attachment: attachment || null
        };
    
        // Step 4: Add the new message to the chat's messages array
        chat.messages.push(newMessage);
    
        // Step 5: Save the updated chat
        const savedChat = await chat.save();
    
        console.log('Message sent successfully:', savedChat);
        successResponse(res, 'Message sent successfully', {
          _id : newMessage._id,
          sender: newMessage.sender?._id,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
          isRead: newMessage.isRead,
          attachment: newMessage.attachment || null
        }, 201);
      } catch (error : Error | any) {

        errorResponse(res, error.message, 500);
        console.error('Error sending message:', error);
        throw error;
      }
}

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { receiverId } = req.query; // Adjust if using req.query or req.params
    console.log("🚀 ~ getMessages ~ receiverId:", receiverId)
    const senderId = req?.user?._id;

    // Ensure both senderId and receiverId are provided
    if (!senderId || !receiverId) {
      return errorResponse(res, 'Sender and receiver IDs are required', 400);
    }

    const chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    })
    .populate('participants', 'name email') // Populate participant details if necessary
    .populate('messages.sender', '_id') // Populate sender details for each message
    .exec();

    if (!chat) {
      return errorResponse(res, 'Chat not found', 404);
    }
    const modifiedChat = {
      ...chat.toObject(),
      messages: chat.messages.map((message: any) => ({
        _id: message._id,
        content: message.content,
        timestamp: message.timestamp,
        isRead: message.isRead,
        attachment: message.attachment,
        sender: message.sender._id // Ensure sender is just the _id
      }))
    };

    return successResponse(res, 'Chat details', modifiedChat, 200); // Changed status code to 200 (OK)
  } catch (error) {
    console.error('Error getting chat details:', error);
    return errorResponse(res, 'Error getting chat details', 500);
  }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req?.user?._id;
        const user = await User.findById(userId);
        if (!user) {
          errorResponse(res, 'User not found', 404);
        }
        successResponse(res, 'User details', {"_id": user?._id, "name": user?.name, "email": user?.email}, 201);
      } catch (error) {
        errorResponse(res, 'Error getting user details', 500);
        throw error;
      }
}