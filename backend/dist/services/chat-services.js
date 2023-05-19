"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAnyNewMessages = exports.getNewMessages = exports.getGroupChats = exports.createMessage = void 0;
const chat_1 = __importDefault(require("../models/chat"));
const database_1 = __importDefault(require("../util/database"));
const createMessage = (user, message, group_id, fileURL, type, t) => {
    // console.log(group_id);
    return user.$create('chat', { message, user: user.name, GroupId: group_id, fileURL, type }, { transaction: t });
};
exports.createMessage = createMessage;
const getGroupChats = (group_id) => {
    return chat_1.default.findAll({ order: [['createdAt', 'ASC']], where: { GroupId: group_id } });
};
exports.getGroupChats = getGroupChats;
const getNewMessages = (count, group_id) => {
    return chat_1.default.findAll({ where: { GroupId: group_id }, order: [['createdAt', 'ASC']], offset: count });
};
exports.getNewMessages = getNewMessages;
const checkAnyNewMessages = () => {
    return chat_1.default.findOne({ attributes: [[database_1.default.fn('COUNT', database_1.default.col('id')), 'total_count']] });
};
exports.checkAnyNewMessages = checkAnyNewMessages;
