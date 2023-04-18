import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import { transaction } from "../services/transaction-services";
import { createNewUser, findUserByEmail } from "../services/user-services";

export const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
    const t = await transaction();
    try{
        const body = req.body as {name: string, email: string, phone: string, password: string};
        let user = await findUserByEmail(body.email);
        if(user.length>0)
            throw new Error('User already exists');
        
        const saltrounds = 8;
        bcrypt.hash(body.password, saltrounds, async (err, hash) => {
            try{
                await createNewUser(body.name, body.email, body.phone, hash, t);
                await t.commit();
                res.status(200).json({success: true, message: 'User created'});
            }
            catch(err: Error | any){
                await t.rollback();
                res.status(201).json({success: false, error: err.message});
            }
        });
    }
    catch(err: Error | any){
        await t.rollback();
        res.status(201).json({success: false, error: err.message});
    }
}