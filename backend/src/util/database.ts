import { config } from 'dotenv';
import { Sequelize } from "sequelize-typescript";
import User from '../models/user';
import Chat from '../models/chat';
import Group from '../models/group';
import GroupMember from '../models/groupmember';
import Attachment from '../models/attachment';
config();

const connection = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST_NAME,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // repositoryMode: true,
    logging: false,
    models: [Chat, User, Group, GroupMember, Attachment]
});

export default connection;