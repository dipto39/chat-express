import express from 'express';
import { getContacts, getMessages, getUser, sendMessage } from '../../controllers/user/User.controllers';
import { authUser } from '../../middlewares/Auth.middleware';
const userRoutes = express.Router();

userRoutes.get('/', authUser, getUser);
userRoutes.get('/get-contacts', authUser, getContacts);
userRoutes.post('/send-message',authUser, sendMessage);
userRoutes.get('/get-messages',authUser, getMessages);
export default userRoutes