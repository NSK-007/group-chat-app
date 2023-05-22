import { QueryTypes, Sequelize, Transaction } from "sequelize"
import Group from "../models/group"
import Groupmember from "../models/groupmember";
import connection from "../util/database";

export const createNewGroup = async (name: String, t: Transaction) => {
    return Group.create({name}, {transaction: t});
}

export const createGroupMembership = (group: Group, uid:number, name: string, admin:boolean, t: Transaction) =>{
    // return group.$create('groupmember', {name}, {transaction: t});
    return group.$create('groupmember', {name, UserId: uid, admin}, {transaction: t});
}

export const findCreatedGroup = (id: number) => {
    return Group.findByPk(id);
}

export const findGroupMembership = (group_id: number, user_id: number) => {
    return Groupmember.findAll({where: {UserId: user_id, GroupId: group_id}})
}

export const getAllUserGroups = (uid: number) => {
    return Groupmember.findAll({where: {UserId: uid}});
}

export const getGroupById = (gid: number) => {
    return Group.findByPk(gid);
}

export const getAllMembersOfGroup = (gid: number) => {
    // return connection.query(`SELECT id, name, email, phone from USERS where id IN (SELECT UserId from GROUPMEMBERS WHERE GroupId  = ?)`, {replacements:[gid] ,type: QueryTypes.SELECT});
    return connection.query(`SELECT USERS.id, USERS.name, email, phone, admin from USERS INNER JOIN GROUPMEMBERS ON GROUPMEMBERS.GroupId = ? AND USERS.id = GROUPMEMBERS.UserID`, {replacements:[gid], type: QueryTypes.SELECT});
}

export const makeGroupAdmin = (gid: number, uid:number, t: Transaction) => {
    return Groupmember.update({admin: true}, {where:{GroupId:gid, UserId: uid} ,transaction: t});
}

export const removeGroupMember = (gid: number, uid: number, t: Transaction) => {
    return Groupmember.destroy({where: {GroupId:gid, UserId: uid}, transaction: t});
}

