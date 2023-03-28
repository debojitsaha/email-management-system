import { Router } from "express";
import {
    CreateUser,
    LoginUser,
    VerifyPhone,
} from "../controllers/user.controller";

const userRouter: Router = Router();

userRouter.post("/create", CreateUser);
userRouter.post("/verify", VerifyPhone);
userRouter.post("/login", LoginUser);

export default userRouter;
