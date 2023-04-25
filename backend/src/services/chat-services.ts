import { Transaction} from "sequelize";
import User from "../models/user"
import Chat from "../models/chat";
import connection from "../util/database";

export const createMessage = (user: User, message: string, group_id: number, t: Transaction) => {
    // console.log(group_id);
    return user.$create('chat', {message, user: user.name, GroupId: group_id}, {transaction: t});
}

export const getGroupChats = (group_id: number) => {
    return Chat.findAll({order:[['createdAt', 'ASC']], where: {GroupId: group_id}});
}

export const getNewMessages = (count: number, group_id: string) => {
    return Chat.findAll({where:{GroupId: group_id} ,order: [['createdAt', 'ASC']], offset: count});
}

export const checkAnyNewMessages = () => {
    return Chat.findOne({attributes: [[connection.fn('COUNT', connection.col('id')) ,'total_count']]});
}