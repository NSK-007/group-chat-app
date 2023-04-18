import { Router } from "express";
import { signUpUser } from "../controllers/user-controller";

const UserRouter = Router();

UserRouter.post('/signUp', signUpUser);

export default UserRouter;