"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGroups = exports.createNewGroup = void 0;
const group_1 = __importDefault(require("../models/group"));
const createNewGroup = (name, t) => {
    return group_1.default.create({ name }, { transaction: t });
};
exports.createNewGroup = createNewGroup;
const getAllGroups = () => {
    return group_1.default.findAll();
};
exports.getAllGroups = getAllGroups;
