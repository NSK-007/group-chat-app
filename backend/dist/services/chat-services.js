"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllChats = exports.createMessage = void 0;
const chat_1 = __importDefault(require("../models/chat"));
const createMessage = (user, message, t) => {
    return user.$create('chat', { message, user: user.name });
};
exports.createMessage = createMessage;
const getAllChats = () => {
    return chat_1.default.findAll();
};
exports.getAllChats = getAllChats;
