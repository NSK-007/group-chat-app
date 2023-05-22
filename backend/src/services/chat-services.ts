import { Transaction} from "sequelize";
import User from "../models/user"
import Chat from "../models/chat";
import connection from "../util/database";
import { Op } from "sequelize";
import ChatArchive from "../models/chat-archive";

export const createMessage = (user: User, message: string, group_id: number, fileURL: string, type: string, t: Transaction) => {
    // console.log(group_id);
    return user.$create('chat', {message, user: user.name, GroupId: group_id, fileURL, type}, {transaction: t});
}

export const getGroupChats = (group_id: number) => {
    return Chat.findAll({order:[['createdAt', 'ASC']], where: {GroupId: group_id}});
}

export const getMessagesFromArchive = (group_id: number) => {
    return ChatArchive.findAll({order:[['created_date', 'DESC']], where: {GroupId: group_id}, limit: 50})
}

export const getNewMessages = (count: number, group_id: string) => {
    return Chat.findAll({where:{GroupId: group_id} ,order: [['createdAt', 'ASC']], offset: count});
}

export const checkAnyNewMessages = () => {
    return Chat.findOne({attributes: [[connection.fn('COUNT', connection.col('id')) ,'total_count']]});
}

export const archiveChats = async () => {
    let chats = await Chat.findAll({order:[['createdAt', 'ASC']], where: {createdAt: { [Op.lte]: new Date(new Date().setDate(new Date().getDate() - 1)) }}});
    for(let i=0;i<chats.length;i++){
        await ChatArchive.create({user: chats[i].user, message: chats[i].message, GroupId: chats[i].GroupId, fileURL: chats[i].fileURL, type: chats[i].type, UserId: chats[i].dataValues.UserId, created_date: chats[i].createdAt, updated_date: chats[i].updatedAt})
    }
    if(chats.length>0)
        await Chat.destroy({where: {createdAt: { [Op.lte]: new Date(new Date().setDate(new Date().getDate() - 1)) } } });
}