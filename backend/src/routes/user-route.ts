import { Router } from "express";
import { signUpUser } from "../controllers/user-controller";
import cors from 'cors';

const UserRouter = Router();
let corsOptions = {
    origin : 'http://127.0.0.1:5500',
    methods: ["POST"]
}

UserRouter.post('/signUp', cors(corsOptions), signUpUser);

export default UserRouter;