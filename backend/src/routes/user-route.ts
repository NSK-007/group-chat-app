import { Router } from "express";
import { getUser, isAdmin, loginUser, signUpUser } from "../controllers/user-controller";
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

UserRouter.get('/is-admin/:group_id', cors(corsOptions), authenticate, isAdmin);

export default UserRouter;