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
exports.removeGroupMember = exports.makeGroupAdmin = exports.getAllMembersOfGroup = exports.getGroupById = exports.getAllUserGroups = exports.findCreatedGroup = exports.createGroupMembership = exports.createNewGroup = void 0;
const sequelize_1 = require("sequelize");
const group_1 = __importDefault(require("../models/group"));
const groupmember_1 = __importDefault(require("../models/groupmember"));
const database_1 = __importDefault(require("../util/database"));
const createNewGroup = (name, t) => __awaiter(void 0, void 0, void 0, function* () {
    return group_1.default.create({ name }, { transaction: t });
});
exports.createNewGroup = createNewGroup;
const createGroupMembership = (group, uid, name, admin, t) => {
    // return group.$create('groupmember', {name}, {transaction: t});
    return group.$create('groupmember', { name, UserId: uid, admin }, { transaction: t });
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
const getAllMembersOfGroup = (gid) => {
    // return connection.query(`SELECT id, name, email, phone from USERS where id IN (SELECT UserId from GROUPMEMBERS WHERE GroupId  = ?)`, {replacements:[gid] ,type: QueryTypes.SELECT});
    return database_1.default.query(`SELECT USERS.id, USERS.name, email, phone, admin from USERS INNER JOIN GROUPMEMBERS ON GROUPMEMBERS.GroupId = ? AND USERS.id = GROUPMEMBERS.UserID`, { replacements: [gid], type: sequelize_1.QueryTypes.SELECT });
};
exports.getAllMembersOfGroup = getAllMembersOfGroup;
const makeGroupAdmin = (gid, uid, t) => {
    return groupmember_1.default.update({ admin: true }, { where: { GroupId: gid, UserId: uid }, transaction: t });
};
exports.makeGroupAdmin = makeGroupAdmin;
const removeGroupMember = (gid, uid, t) => {
    return groupmember_1.default.destroy({ where: { GroupId: gid, UserId: uid }, transaction: t });
};
exports.removeGroupMember = removeGroupMember;
