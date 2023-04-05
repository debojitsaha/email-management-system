import { Router } from "express";
import { ArchiveEmail, InboxEmails, SendEmail, SentEmails, UnarchiveEmail } from "../controllers/email.controller";

const emailRouter: Router = Router();

emailRouter.post("/send", SendEmail);
emailRouter.get("/sent/:userId", SentEmails);
emailRouter.get("/inbox/:userId", InboxEmails);
emailRouter.get("/archive/:userId/:emailId", ArchiveEmail);
emailRouter.get("/unarchive/:userId/:emailId", UnarchiveEmail);

export default emailRouter;
