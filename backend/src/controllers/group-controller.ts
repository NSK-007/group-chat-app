import { NextFunction, Request, Response } from "express";
import { transaction } from "../services/transaction-services";
import { createGroupMembership, createNewGroup, findCreatedGroup, findGroupMembership, getAllMembersOfGroup, getAllUserGroups, getGroupById, makeGroupAdmin, removeGroupMember } from "../services/group-services";
import Group from "../models/group";
import { findUserByPhone } from "../services/user-services";

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    let group;
    try{
      group = await createNewGroup(req.body.name, t);
    //   console.log(+req.user.id);
      await createGroupMembership(group, +req.user.id, req.body.name, true, t);
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

        let memship = await findGroupMembership(+params.group_id, user.id);
        // console.log(memship);
        if(memship.length>0)
            throw new Error('User is already a member');

        let membership = await createGroupMembership(group, +user.id, group.name, false, t);
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

export const getGroupMembers = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let params = req.params as {group_id: string}
        let members = await getAllMembersOfGroup(+params.group_id);
        res.status(200).json({success: true, members}); 
    }
    catch(err: Error | any){
        res.status(201).send({success: false, error: err.message});
    }   
}

export const makeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    try{
        let params = req.params as {group_id: string, user_id: string};
        let update = await makeGroupAdmin(+params.group_id, +params.user_id, t);
        await t.commit();
        res.status(200).json({success: true, message:'Made Admin'});
    }
    catch(err: Error | any){
        console.log(err);
        await t.rollback();
        res.status(201).send({success: false, error: err.message});
    }
}

export const removeMember = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    try{
        let params = req.params as {group_id: string, user_id: string};
        let deletes = await removeGroupMember(+params.group_id, +params.user_id, t);
        await t.commit();
        res.status(200).json({success: true, message:'Membership Removed'});
    }
    catch(err: Error | any){
        console.log(err);
        await t.rollback();
        res.status(201).send({success: false, error: err.message});
    }
}