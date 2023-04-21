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
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield (0, transaction_services_1.transaction)();
    try {
        let currentUser = req.user;
        const body = req.body;
        let message = yield (0, chat_services_1.createMessage)(currentUser, body.message, t);
        yield t.commit();
        res.status(200).json({ success: true, message: message });
    }
    catch (err) {
        yield t.rollback();
        res.status(201).send({ success: false, error: err.message });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield (0, chat_services_1.getAllChats)();
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
        let new_messages = yield (0, chat_services_1.getNewMessages)(+params.count);
        res.status(200).json({ success: true, new_messages });
    }
    catch (err) {
        console.log(err);
        res.status(201).send({ success: false, error: err.message });
    }
});
exports.newMessages = newMessages;
