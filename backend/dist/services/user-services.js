"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByPhone = exports.findUserById = exports.findUserByEmail = exports.createNewUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const createNewUser = (name, email, phone, hash, t) => {
    return user_1.default.create({ name, email, phone, password: hash }, { transaction: t });
};
exports.createNewUser = createNewUser;
const findUserByEmail = (email) => {
    return user_1.default.findAll({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
const findUserById = (u_id) => {
    return user_1.default.findByPk(u_id);
};
exports.findUserById = findUserById;
const findUserByPhone = (phone) => {
    return user_1.default.findOne({ where: { phone } });
};
exports.findUserByPhone = findUserByPhone;
