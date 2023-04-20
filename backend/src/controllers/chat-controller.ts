import { NextFunction, Request, Response } from "express";
import { createMessage } from "../services/chat-services";
import { transaction } from "../services/transaction-services";

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    try{
        let currentUser = req.user;
        const body = req.body as {message: string};
        await createMessage(currentUser, body.message, t);
        await t.commit();
        res.status(200).json({success: true, message: 'Message delivered'});
    }
    catch(err: Error | any){
        await t.rollback();
        res.status(201).send({success: false, error: err.message});
    }
}