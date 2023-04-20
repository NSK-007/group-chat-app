import { Router } from "express";
import { getUser, loginUser, signUpUser } from "../controllers/user-controller";
import cors from 'cors';
import { authenticate } from "../middleware/authenticate";

const UserRouter = Router();
let corsOptions = {
    origin : 'http://127.0.0.1:5500',
    methods: ["POST", "GET"]
}

UserRouter.post('/signUp', cors(corsOptions), signUpUser);

UserRouter.post('/login', cors(corsOptions), loginUser);

UserRouter.get('/get-user', cors(corsOptions), authenticate, getUser);

export default UserRouter;