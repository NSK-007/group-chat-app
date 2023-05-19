import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { findUserById } from "../services/user-services";
config();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.setHeader('Accept', '*/*');
        const token: string = req.header('Authorization')!;
        // console.log(req.body);
        let user;
        const LoggedInUser = verify(token, process.env.TOKEN_SECRET!)!;
        if(!LoggedInUser)
            throw new Error('Please login to continue');
        if(typeof LoggedInUser !== 'string')
            user = await findUserById(LoggedInUser.id);
        if(user === null)
            throw new Error('User not found');
        req.user = user;
        next();
    }
    catch(err: Error | any){
        res.status(201).send({success: false, error: err.message});
    }
}