import { Router } from "express";
import { SendEmail, SentEmails } from "../controllers/email.controller";

const emailRouter: Router = Router();

emailRouter.post("/send", SendEmail);
emailRouter.get("/sent/:userId", SentEmails);

export default emailRouter;
