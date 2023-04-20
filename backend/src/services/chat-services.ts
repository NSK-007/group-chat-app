import { Transaction } from "sequelize";
import User from "../models/user"
import Chat from "../models/chat";

export const createMessage = (user: User, message: string, t: Transaction) => {
    return user.$create('chat', {message, user: user.name});
}

export const getAllChats = () => {
    return Chat.findAll();
}