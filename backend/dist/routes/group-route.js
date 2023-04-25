"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const cors_1 = __importDefault(require("cors"));
const group_controller_1 = require("../controllers/group-controller");
const GroupRouter = (0, express_1.Router)();
let corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ["POST", "GET"]
};
GroupRouter.get('/get-groups', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, group_controller_1.getGroups);
GroupRouter.post('/create-group', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, group_controller_1.createGroup);
GroupRouter.post('/add-new-member/:group_id', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, group_controller_1.createMembership);
exports.default = GroupRouter;
