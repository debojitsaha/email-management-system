import { Request, Response, Router } from "express";
import { GenerateResponse } from "../utils/response.creator";
import emailRouter from "./email.route";
import userRouter from "./user.routes";

const mainRouter: Router = Router();

// Add routes defined in other files below.

mainRouter.use('/user',userRouter)
mainRouter.use('/email',emailRouter)

mainRouter.use((req: Request, res: Response) => {
    GenerateResponse(res, 404);
});

export { mainRouter };
