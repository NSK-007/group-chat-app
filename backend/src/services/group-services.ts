import { Transaction } from "sequelize"
import Group from "../models/group"

export const createNewGroup = (name: String, t: Transaction) => {
    return Group.create({name}, {transaction: t})
}

export const getAllGroups = () => {
    return Group.findAll();
}