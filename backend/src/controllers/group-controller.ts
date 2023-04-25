import { NextFunction, Request, Response } from "express";
import { transaction } from "../services/transaction-services";
import { createGroupMembership, createNewGroup, findCreatedGroup, getAllUserGroups, getGroupById } from "../services/group-services";
import Group from "../models/group";
import { findUserByPhone } from "../services/user-services";

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    let group;
    try{
      group = await createNewGroup(req.body.name, t);
    //   console.log(+req.user.id);
      await createGroupMembership(group, +req.user.id, req.body.name, t);
      await t.commit();
      res.status(200).json({success: true, group});
    }
    catch(err: Error | any){
        console.log(err)
        await t.rollback();
        res.status(201).send({success: false, error: err.message, group, user: req.user})
    }
}

export const createMembership = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    let group;
    try{
        let params = req.params as {group_id: string};
        let body = req.body as {phone: string};
        group = await getGroupById(+params.group_id);
        if(group===undefined || group === null)
            throw new Error('Group Not Found');
        let user = await findUserByPhone(body.phone);
        if(user===undefined || user === null)
            throw new Error('User Not Found');
        let membership = await createGroupMembership(group, +user.id, group.name, t);
        await t.commit();
        res.status(200).json({success: true, membership});
    }
    catch(err: Error | any){
        console.log(err)
        await t.rollback();
        res.status(201).send({success: false, error: err.message})
    }
}

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let groups = await getAllUserGroups(+req.user.id);
        res.status(200).json({success: true, groups});
    }
    catch(err: Error | any){
        res.status(201).send({success: false, error: err.message});
    }
}