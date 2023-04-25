import { Transaction } from "sequelize"
import Group from "../models/group"
import Groupmember from "../models/groupmember";

export const createNewGroup = async (name: String, t: Transaction) => {
    return Group.create({name}, {transaction: t});
}

export const createGroupMembership = (group: Group, uid:number, name: string, t: Transaction) =>{
    // return group.$create('groupmember', {name}, {transaction: t});
    return group.$create('groupmember', {name, UserId: uid}, {transaction: t});
}

export const findCreatedGroup = (id: number) => {
    return Group.findByPk(id);
}

export const getAllUserGroups = (uid: number) => {
    return Groupmember.findAll({where: {UserId: uid}});
}

export const getGroupById = (gid: number) => {
    return Group.findByPk(gid);
}

