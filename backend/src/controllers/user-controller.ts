import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';
import { transaction } from "../services/transaction-services";
import { createNewUser, findUserByEmail } from "../services/user-services";
import User from "../models/user";
import { sign } from "jsonwebtoken";
import { config } from "dotenv";
config();


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

const generateToken = (user: User) => {
    const token_secret: string | any = process.env.TOKEN_SECRET;
    return sign({id: user.id, name: user.name}, token_secret);
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const body = req.body as {email: string, password: string};
        let user = await findUserByEmail(body.email);
        if(user.length<=0)
            throw new Error('User doesn\'t exists');
        let flag = await bcrypt.compare(body.password, user[0].password);
        if(!flag)
            throw new Error('Incorrect Password');
        const token = generateToken(user[0]);
        res.status(200).json({success: true, message: 'Login Successful', token: token});
            
    }
    catch(err: Error | any){
        res.status(201).send({success: false, error: err.message});
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        let {id, name, email, phone} = req.user;
        let user = {
            id, name, email, phone
        }
        res.status(200).json({success: true, user});
    }
    catch(err: Error | any){
        res.status(201).send({success: false, error: err.message});
    }
}