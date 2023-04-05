import { NextFunction, Request, Response } from "express";
import { GenerateResponse } from "../utils/response.creator";
const jwt = require("jsonwebtoken");
import * as userService from "../services/user.service";

const Auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // receives the auth token from header as bearer token.
        const authToken = req.headers.authorization?.split(" ")[1];
        if (!authToken)
            return GenerateResponse(res, 401, {}, "Token not found");

        // verifying the auth token received using jwt.
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);

        // find the user with the received id & assign to req.body.user.
        const user = await userService.findUser(decoded.id);
        req.body.user = user;

        next();
    } catch (error: any) {
        return GenerateResponse(res, 401, {}, "Expired or Invalid Token");
    }
};

export default Auth;
