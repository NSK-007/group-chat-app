import { NextFunction, Request, Response } from "express";
import { checkAnyNewMessages, createMessage, getAllChats, getNewMessages } from "../services/chat-services";
import { transaction } from "../services/transaction-services";

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    try{
        let currentUser = req.user;
        const body = req.body as {message: string};
        let message = await createMessage(currentUser, body.message, t);
        await t.commit();
        res.status(200).json({success: true, message: message});
    }
    catch(err: Error | any){
        await t.rollback();
        res.status(201).send({success: false, error: err.message});
    }
}

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const messages = await getAllChats();
        res.status(200).json({success: true, messages});
    }
    catch(err: Error | any){
        res.status(201).send({success: false, error: err.message});
    }
}

export const newMessages = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const params = req.params as {count: string};
        let new_messages = await getNewMessages(+params.count);
        res.status(200).json({success: true, new_messages});
    }
    catch(err: Error | any){
        console.log(err);
        res.status(201).send({success: false, error: err.message})
    }
}