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
exports.getUser = exports.loginUser = exports.signUpUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const transaction_services_1 = require("../services/transaction-services");
const user_services_1 = require("../services/user-services");
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const signUpUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const t = yield (0, transaction_services_1.transaction)();
    try {
        const body = req.body;
        let user = yield (0, user_services_1.findUserByEmail)(body.email);
        if (user.length > 0)
            throw new Error('User already exists');
        const saltrounds = 8;
        bcrypt_1.default.hash(body.password, saltrounds, (err, hash) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield (0, user_services_1.createNewUser)(body.name, body.email, body.phone, hash, t);
                yield t.commit();
                res.status(200).json({ success: true, message: 'User created' });
            }
            catch (err) {
                yield t.rollback();
                res.status(201).json({ success: false, error: err.message });
            }
        }));
    }
    catch (err) {
        yield t.rollback();
        res.status(201).json({ success: false, error: err.message });
    }
});
exports.signUpUser = signUpUser;
const generateToken = (user) => {
    const token_secret = process.env.TOKEN_SECRET;
    return (0, jsonwebtoken_1.sign)({ id: user.id, name: user.name }, token_secret);
};
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        let user = yield (0, user_services_1.findUserByEmail)(body.email);
        if (user.length <= 0)
            throw new Error('User doesn\'t exists');
        let flag = yield bcrypt_1.default.compare(body.password, user[0].password);
        if (!flag)
            throw new Error('Incorrect Password');
        const token = generateToken(user[0]);
        res.status(200).json({ success: true, message: 'Login Successful', token: token });
    }
    catch (err) {
        res.status(201).send({ success: false, error: err.message });
    }
});
exports.loginUser = loginUser;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { id, name, email, phone } = req.user;
        let user = {
            id, name, email, phone
        };
        res.status(200).json({ success: true, user });
    }
    catch (err) {
        res.status(201).send({ success: false, error: err.message });
    }
});
exports.getUser = getUser;
