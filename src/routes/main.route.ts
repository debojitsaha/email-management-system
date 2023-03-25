import { Request, Response, Router } from "express";
import { GenerateResponse } from "../utils/response.creator";
import userRouter from "./user.routes";

const mainRouter: Router = Router();

// Add routes defined in other files below.

mainRouter.use((req: Request, res: Response) => {
    GenerateResponse(res, 404);
});

mainRouter.use('/user',userRouter)

export { mainRouter };
