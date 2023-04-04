import { Router } from "express";
import { SendEmail } from "../controllers/email.controller";

const emailRouter: Router= Router()

emailRouter.post("/send",SendEmail)

export default emailRouter