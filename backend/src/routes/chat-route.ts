import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import cors from 'cors';
import { getMessages, newMessages, sendMessage } from "../controllers/chat-controller";

const ChatRouter = Router();
let corsOptions = {
    origin : 'http://127.0.0.1:5500',
    methods: ["POST", "GET"]
}
ChatRouter.get('/new-messages/:count', cors(corsOptions), authenticate, newMessages);

ChatRouter.get('/get-messages', cors(corsOptions), authenticate, getMessages);

ChatRouter.post('/send-message', cors(corsOptions), authenticate, sendMessage);
export default ChatRouter;