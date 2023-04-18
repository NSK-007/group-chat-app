"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByEmail = exports.createNewUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const createNewUser = (name, email, phone, hash, t) => {
    return user_1.default.create({ name, email, phone, password: hash }, { transaction: t });
};
exports.createNewUser = createNewUser;
const findUserByEmail = (email) => {
    return user_1.default.findAll({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
