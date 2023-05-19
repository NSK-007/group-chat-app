import { Router, Request } from "express";
import { authenticate } from "../middleware/authenticate";
import cors from 'cors';
import { getMessages, newMessages, sendMessage } from "../controllers/chat-controller";
import multer from "multer";

const ChatRouter = Router();
let corsOptions = {
    origin : 'http://127.0.0.1:5501',
    methods: ["POST", "GET"]
}
ChatRouter.get('/new-messages/:count/:group_id', cors(corsOptions), authenticate, newMessages);

ChatRouter.get('/get-messages/:group_id', cors(corsOptions), authenticate, getMessages);

// var storage = multer.diskStorage(
//     {
//         destination: './uploads/',
//         filename: function ( req, file, cb ) {
//             cb( null, file.originalname );
//             return file;
//         }
//     }
// );
const upload = multer();
// let file = upload.single('')
ChatRouter.post('/send-message/:group_id', upload.single('multimedia'), authenticate, sendMessage);
// ChatRouter.post('/send-message/:group_id', authenticate, sendMessage);


export default ChatRouter;