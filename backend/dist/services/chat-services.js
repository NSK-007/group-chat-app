"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archiveChats = exports.checkAnyNewMessages = exports.getNewMessages = exports.getMessagesFromArchive = exports.getGroupChats = exports.createMessage = void 0;
const chat_1 = __importDefault(require("../models/chat"));
const database_1 = __importDefault(require("../util/database"));
const sequelize_1 = require("sequelize");
const chat_archive_1 = __importDefault(require("../models/chat-archive"));
const createMessage = (user, message, group_id, fileURL, type, t) => {
    // console.log(group_id);
    return user.$create('chat', { message, user: user.name, GroupId: group_id, fileURL, type }, { transaction: t });
};
exports.createMessage = createMessage;
const getGroupChats = (group_id) => {
    return chat_1.default.findAll({ order: [['createdAt', 'ASC']], where: { GroupId: group_id } });
};
exports.getGroupChats = getGroupChats;
const getMessagesFromArchive = (group_id) => {
    return chat_archive_1.default.findAll({ order: [['created_date', 'DESC']], where: { GroupId: group_id }, limit: 50 });
};
exports.getMessagesFromArchive = getMessagesFromArchive;
const getNewMessages = (count, group_id) => {
    return chat_1.default.findAll({ where: { GroupId: group_id }, order: [['createdAt', 'ASC']], offset: count });
};
exports.getNewMessages = getNewMessages;
const checkAnyNewMessages = () => {
    return chat_1.default.findOne({ attributes: [[database_1.default.fn('COUNT', database_1.default.col('id')), 'total_count']] });
};
exports.checkAnyNewMessages = checkAnyNewMessages;
const archiveChats = () => __awaiter(void 0, void 0, void 0, function* () {
    let chats = yield chat_1.default.findAll({ order: [['createdAt', 'ASC']], where: { createdAt: { [sequelize_1.Op.lte]: new Date(new Date().setDate(new Date().getDate() - 1)) } } });
    for (let i = 0; i < chats.length; i++) {
        yield chat_archive_1.default.create({ user: chats[i].user, message: chats[i].message, GroupId: chats[i].GroupId, fileURL: chats[i].fileURL, type: chats[i].type, UserId: chats[i].dataValues.UserId, created_date: chats[i].createdAt, updated_date: chats[i].updatedAt });
    }
    if (chats.length > 0)
        yield chat_1.default.destroy({ where: { createdAt: { [sequelize_1.Op.lte]: new Date(new Date().setDate(new Date().getDate() - 1)) } } });
});
exports.archiveChats = archiveChats;
