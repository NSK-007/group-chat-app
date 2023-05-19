"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const sequelize_typescript_1 = require("sequelize-typescript");
const user_1 = __importDefault(require("../models/user"));
const chat_1 = __importDefault(require("../models/chat"));
const group_1 = __importDefault(require("../models/group"));
const groupmember_1 = __importDefault(require("../models/groupmember"));
const attachment_1 = __importDefault(require("../models/attachment"));
(0, dotenv_1.config)();
const connection = new sequelize_typescript_1.Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST_NAME,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // repositoryMode: true,
    logging: false,
    models: [chat_1.default, user_1.default, group_1.default, groupmember_1.default, attachment_1.default]
});
exports.default = connection;
