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
Object.defineProperty(exports, "__esModule", { value: true });
exports.newMessages = exports.getMessages = exports.sendMessage = void 0;
const chat_services_1 = require("../services/chat-services");
const transaction_services_1 = require("../services/transaction-services");
const app_file = require("../app");
const S3_services_1 = require("../services/S3-services");
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield (0, transaction_services_1.transaction)();
    try {
        let currentUser = req.user;
        let params = req.params;
        // console.log(req.body, req.file);
        let file = req.file;
        if (req.body.length === 0 && req.file === undefined)
            throw new Error('No Data Present');
        let message;
        let filename;
        let fileURL = '';
        let type = '';
        if (file !== undefined) {
            type = file.originalname.split('.')[1];
            filename = file.originalname.split('.')[0] + new Date() + '.' + type;
            fileURL = (yield (0, S3_services_1.uploadToS3)(filename, file, file.mimetype));
            // console.log(fileURL);
        }
        message = yield (0, chat_services_1.createMessage)(currentUser, req.body.message, +params.group_id, fileURL, type, t);
        let connection = app_file.getSocket();
        yield connection.io.emit('new-message', message);
        yield t.commit();
        res.status(200).json({ success: true, message: message });
    }
    catch (err) {
        console.log(err);
        yield t.rollback();
        res.status(201).send({ success: false, error: err.message });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let params = req.params;
        let messages = yield (0, chat_services_1.getGroupChats)(+params.group_id);
        if (messages.length === 0) {
            messages = yield (0, chat_services_1.getMessagesFromArchive)(+params.group_id);
        }
        res.status(200).json({ success: true, messages });
    }
    catch (err) {
        res.status(201).send({ success: false, error: err.message });
    }
});
exports.getMessages = getMessages;
const newMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.params;
        let new_messages = yield (0, chat_services_1.getNewMessages)(+params.count, params.group_id);
        res.status(200).json({ success: true, new_messages });
    }
    catch (err) {
        console.log(err);
        res.status(201).send({ success: false, error: err.message });
    }
});
exports.newMessages = newMessages;
