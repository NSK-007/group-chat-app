import { Transaction} from "sequelize";
import User from "../models/user"
import Chat from "../models/chat";
import connection from "../util/database";

export const createMessage = (user: User, message: string, t: Transaction) => {
    return user.$create('chat', {message, user: user.name});
}

export const getAllChats = () => {
    return Chat.findAll({order:[['createdAt', 'ASC']]});
}

export const getNewMessages = (count: number) => {
    return Chat.findAll({order: [['createdAt', 'ASC']], offset: count});
}

export const checkAnyNewMessages = () => {
    return Chat.findOne({attributes: [[connection.fn('COUNT', connection.col('id')) ,'total_count']]});
}