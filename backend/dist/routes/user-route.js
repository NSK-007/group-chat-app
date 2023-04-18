"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user-controller");
const UserRouter = (0, express_1.Router)();
UserRouter.post('/signUp', user_controller_1.signUpUser);
exports.default = UserRouter;
