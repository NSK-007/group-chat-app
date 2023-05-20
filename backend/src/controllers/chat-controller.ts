import { NextFunction, Request, Response } from "express";
import { createMessage, getNewMessages, getGroupChats, getMessagesFromArchive} from "../services/chat-services";
import { transaction } from "../services/transaction-services";
import app_file = require('../app');
import { uploadToS3 } from "../services/S3-services";

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    try{
        let currentUser = req.user;
        let params = req.params as {group_id: string};
        // console.log(req.body, req.file);
        let file = req.file as Express.Multer.File

        if(req.body.length===0 && req.file === undefined)
            throw new Error('No Data Present');

        let message;
        let filename;
        let fileURL = '';
        let type='';
        if(file!==undefined){
            type = file.originalname.split('.')[1];
            filename = file.originalname.split('.')[0]+new Date()+'.'+type;
            fileURL = await uploadToS3(filename, file, file.mimetype) as string;
            // console.log(fileURL);
        }
            
        message = await createMessage(currentUser, req.body.message, +params.group_id, fileURL, type, t);
        let connection = app_file.getSocket();
        await connection.io.emit('new-message', message); 
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
        let messages = await getGroupChats(+params.group_id);

        if(messages.length===0){
            messages = await getMessagesFromArchive(+params.group_id);
        }

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