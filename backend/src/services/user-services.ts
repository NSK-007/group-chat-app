import { Transaction, where } from "sequelize";
import User from "../models/user"
import Groupmember from "../models/groupmember";

export const createNewUser = (name: string, email: string, phone: string, hash: string, t: Transaction) => {
    return User.create({name, email, phone, password: hash}, {transaction: t});
}

export const findUserByEmail = (email: string) => {
    return User.findAll({where:{email}});
} 

export const findUserById = (u_id: number) => {
    return User.findByPk(u_id);
}

export const findUserByPhone = (phone: string) => {
    return User.findOne({where: {phone}});
}

export const checkIfAdmin = (group_id: number, uid: number) => {
    return Groupmember.findAll({where: {UserId: uid, GroupId: group_id, admin:true}});
}