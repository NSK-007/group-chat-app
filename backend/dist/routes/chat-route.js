"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const cors_1 = __importDefault(require("cors"));
const chat_controller_1 = require("../controllers/chat-controller");
const ChatRouter = (0, express_1.Router)();
let corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ["POST", "GET"]
};
ChatRouter.get('/new-messages/:count/:group_id', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, chat_controller_1.newMessages);
ChatRouter.get('/get-messages/:group_id', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, chat_controller_1.getMessages);
ChatRouter.post('/send-message/:group_id', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, chat_controller_1.sendMessage);
exports.default = ChatRouter;
