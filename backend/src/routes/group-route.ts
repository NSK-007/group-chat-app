import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import cors from 'cors';
import { createGroup, createMembership, getGroups } from "../controllers/group-controller";

const GroupRouter = Router();
let corsOptions = {
    origin : 'http://127.0.0.1:5500',
    methods: ["POST", "GET"]
}

GroupRouter.get('/get-groups', cors(corsOptions), authenticate, getGroups);

GroupRouter.post('/create-group', cors(corsOptions), authenticate, createGroup);

GroupRouter.post('/add-new-member/:group_id', cors(corsOptions), authenticate, createMembership);

export default GroupRouter;