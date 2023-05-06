import { NextFunction, Request, Response } from "express";
import { createMessage, getNewMessages, getGroupChats } from "../services/chat-services";
import { transaction } from "../services/transaction-services";
import app_file = require('../app');

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    try{
        let currentUser = req.user;
        const body = req.body as {message: string};
        let params = req.params as {group_id: string};

        let message = await createMessage(currentUser, body.message, +params.group_id, t);

        // let message = {};

        let connection = app_file.getSocket();
        // console.log(socket);
        connection.io.emit('new-message', message); 
        await t.commit();
        res.status(200).json({success: true, message: message});
    }
    catch(err: Error | any){
        console.log(err);
        await t.rollback();
        res.status(201).send({success: false, error: err.message});
    }
}

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let params = req.params as {group_id: string};
        const messages = await getGroupChats(+params.group_id);
        res.status(200).json({success: true, messages});
    }
    catch(err: Error | any){
        res.status(201).send({success: false, error: err.message});
    }
}

export const newMessages = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const params = req.params as {count: string, group_id: string};
        let new_messages = await getNewMessages(+params.count, params.group_id);



        res.status(200).json({success: true, new_messages});
    }
    catch(err: Error | any){
        console.log(err);
        res.status(201).send({success: false, error: err.message})
    }
}