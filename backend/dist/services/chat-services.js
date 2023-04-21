"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAnyNewMessages = exports.getNewMessages = exports.getAllChats = exports.createMessage = void 0;
const chat_1 = __importDefault(require("../models/chat"));
const database_1 = __importDefault(require("../util/database"));
const createMessage = (user, message, t) => {
    return user.$create('chat', { message, user: user.name });
};
exports.createMessage = createMessage;
const getAllChats = () => {
    return chat_1.default.findAll({ order: [['createdAt', 'ASC']] });
};
exports.getAllChats = getAllChats;
const getNewMessages = (count) => {
    return chat_1.default.findAll({ order: [['createdAt', 'ASC']], offset: count });
};
exports.getNewMessages = getNewMessages;
const checkAnyNewMessages = () => {
    return chat_1.default.findOne({ attributes: [[database_1.default.fn('COUNT', database_1.default.col('id')), 'total_count']] });
};
exports.checkAnyNewMessages = checkAnyNewMessages;
