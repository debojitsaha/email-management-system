import { Router } from "express";
import {
    ArchiveEmail,
    InboxEmails,
    SendEmail,
    SentEmails,
    UnarchiveEmail,
} from "../controllers/email.controller";
import Auth from "../middlewares/authentication.middleware";

const emailRouter: Router = Router();

emailRouter.post("/send", Auth, SendEmail);
emailRouter.get("/sent", Auth, SentEmails);
emailRouter.get("/inbox", Auth, InboxEmails);
emailRouter.get("/archive/:emailId", Auth, ArchiveEmail);
emailRouter.get("/unarchive/:emailId", Auth, UnarchiveEmail);

export default emailRouter;
