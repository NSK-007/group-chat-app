import { config } from 'dotenv';
import { Sequelize } from "sequelize-typescript";
import User from '../models/user';
config();

const connection = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST_NAME,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    models: [User]
});

export default connection;