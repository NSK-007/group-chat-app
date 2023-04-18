import { Router } from "express";
import { loginUser, signUpUser } from "../controllers/user-controller";
import cors from 'cors';

const UserRouter = Router();
let corsOptions = {
    origin : 'http://127.0.0.1:5500',
    methods: ["POST", "GET"]
}

UserRouter.post('/signUp', cors(corsOptions), signUpUser);

UserRouter.post('/login', cors(corsOptions), loginUser);

export default UserRouter;