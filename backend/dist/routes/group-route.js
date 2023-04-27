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
    methods: ["POST", "GET", "PUT"]
};
GroupRouter.get('/get-groups', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, group_controller_1.getGroups);
GroupRouter.get('/get-group-members/:group_id', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, group_controller_1.getGroupMembers);
GroupRouter.post('/create-group', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, group_controller_1.createGroup);
GroupRouter.post('/add-new-member/:group_id', (0, cors_1.default)(corsOptions), authenticate_1.authenticate, group_controller_1.createMembership);
GroupRouter.put('/make-admin/:group_id/:user_id', (0, cors_1.default)({ origin: 'http://127.0.0.1:5500', methods: ["PUT"] }), authenticate_1.authenticate, group_controller_1.makeAdmin);
GroupRouter.delete('/remove-member/:group_id/:user_id', (0, cors_1.default)({ origin: 'http://127.0.0.1:5500', methods: ['DELETE'] }), authenticate_1.authenticate, group_controller_1.removeMember);
exports.default = GroupRouter;
