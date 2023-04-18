import { Transaction } from "sequelize";
import User from "../models/user"

export const createNewUser = (name: string, email: string, phone: string, hash: string, t: Transaction) => {
    return User.create({name, email, phone, password: hash}, {transaction: t});
}

export const findUserByEmail = (email: string) => {
    return User.findAll({where:{email}});
} 