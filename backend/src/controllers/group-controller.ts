import { NextFunction, Request, Response } from "express";
import { transaction } from "../services/transaction-services";
import { createNewGroup, getAllGroups } from "../services/group-services";

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    try{
        const body = req.body as {name: string};
        let group = await createNewGroup(body.name, t);
        await t.commit();
        res.status(200).json({success: true, group});
    }
    catch(err: Error | any){
        await t.rollback();
        res.status(201).send({success: false, error: err.message})
    }
}

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let groups = await getAllGroups();
        res.status(200).json({success: true, groups});
    }
    catch(err: Error | any){
        res.status(201).send({success: false, error: err.message});
    }
}