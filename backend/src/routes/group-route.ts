import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import cors from 'cors';
import { createGroup, createMembership, getGroupMembers, getGroups, makeAdmin, removeMember } from "../controllers/group-controller";

const GroupRouter = Router();
let corsOptions = {
    origin : 'http://127.0.0.1:5500',
    methods: ["POST", "GET", "PUT"]
}

GroupRouter.get('/get-groups', cors(corsOptions), authenticate, getGroups);

GroupRouter.get('/get-group-members/:group_id', cors(corsOptions), authenticate, getGroupMembers);

GroupRouter.post('/create-group', cors(corsOptions), authenticate, createGroup);

GroupRouter.post('/add-new-member/:group_id', cors(corsOptions), authenticate, createMembership);

GroupRouter.put('/make-admin/:group_id/:user_id', cors({origin: 'http://127.0.0.1:5500', methods:["PUT"]}), authenticate, makeAdmin);

GroupRouter.delete('/remove-member/:group_id/:user_id', cors({origin: 'http://127.0.0.1:5500', methods:['DELETE']}), authenticate, removeMember);

export default GroupRouter;