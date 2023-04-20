"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user-controller");
const cors_1 = __importDefault(require("cors"));
const authenticate_1 = require("../middleware/authenticate");
const UserRouter = (0, express_1.Router)();
let corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ["POST", "GET"]
};
UserRouter.post('/signUp', (0, cors_1.default)(corsOptions), user_controller_1.signUpUser);
UserRouter.post('/login', (0, cors_1.default)(corsOptions), user_controller_1.loginUser);
UserRouter.get('/get-user', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, user_controller_1.getUser);
exports.default = UserRouter;
