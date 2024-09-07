import express from 'express';
const apiRoutes = express.Router();
import { login, signUp, getOtp, verifyOtp } from '../controllers/Auth.controllers';
import userRoutes from './user/user';


apiRoutes.get('/', (req, res) => {
    res.send('Welcome to chat api');
});
apiRoutes.post('/sign-up', signUp);
apiRoutes.post('/login', login);
apiRoutes.post('/get-otp', getOtp);
apiRoutes.post('/verify-otp', verifyOtp);

apiRoutes.use('/user', userRoutes)
export default apiRoutes