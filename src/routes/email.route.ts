import { Router } from "express";
import { InboxEmails, SendEmail, SentEmails } from "../controllers/email.controller";

const emailRouter: Router = Router();

emailRouter.post("/send", SendEmail);
emailRouter.get("/sent/:userId", SentEmails);
emailRouter.get("/inbox/:userId", InboxEmails);

export default emailRouter;
