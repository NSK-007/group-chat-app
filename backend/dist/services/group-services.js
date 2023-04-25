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
exports.getGroupById = exports.getAllUserGroups = exports.findCreatedGroup = exports.createGroupMembership = exports.createNewGroup = void 0;
const group_1 = __importDefault(require("../models/group"));
const groupmember_1 = __importDefault(require("../models/groupmember"));
const createNewGroup = (name, t) => __awaiter(void 0, void 0, void 0, function* () {
    return group_1.default.create({ name }, { transaction: t });
});
exports.createNewGroup = createNewGroup;
const createGroupMembership = (group, uid, name, t) => {
    // return group.$create('groupmember', {name}, {transaction: t});
    return group.$create('groupmember', { name, UserId: uid }, { transaction: t });
};
exports.createGroupMembership = createGroupMembership;
const findCreatedGroup = (id) => {
    return group_1.default.findByPk(id);
};
exports.findCreatedGroup = findCreatedGroup;
const getAllUserGroups = (uid) => {
    return groupmember_1.default.findAll({ where: { UserId: uid } });
};
exports.getAllUserGroups = getAllUserGroups;
const getGroupById = (gid) => {
    return group_1.default.findByPk(gid);
};
exports.getGroupById = getGroupById;
