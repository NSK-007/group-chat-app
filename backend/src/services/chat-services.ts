import { Transaction } from "sequelize";
import User from "../models/user"
// import connection from "../util/database"
import Chat from "../models/chat";

export const createMessage = (user: User, message: string, t: Transaction) => {
    // const userRepository = connection.getRepository(User);
    // return userRepository.create({message}, {include: [Chat]});
    return user.$create('chat', {message});
}