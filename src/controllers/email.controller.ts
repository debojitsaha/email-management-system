import { Request, Response } from "express";
import { GenerateResponse } from "../utils/response.creator";
import { EmailDto } from "../dtos/email.dto";
import * as emailService from "../services/email.service";
import * as userService from "../services/user.service";

/**
 * Controller to create a new email after verifying the receiver, cc & bcc emails.
 * 
 * @param {Request} req express request interface
 * @param {Response} res express response interface
 * @returns {Promise<Response>} returns status code 201, email created & a message.
 */
const SendEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const email: EmailDto = { ...req.body };

        // check if reveiver exists
        const receiverEmail = await userService.fetchUserByEmail(
            email.receiver
        );
        if (!receiverEmail)
            return GenerateResponse(res, 400, {}, "User does not exist");

        // checking all the emails in the cc & bcc
        if (email.cc) {
            for (var existingEmail of email.cc) {
                const checkEmail = await userService.fetchUserByEmail(
                    existingEmail
                );
                // console.log(existingEmail, checkEmail)
                if (!checkEmail)
                    return GenerateResponse(
                        res,
                        400,
                        {},
                        "User does not exist"
                    );
            }
        }

        if (email.bcc) {
            for (var existingEmail of email.bcc) {
                const checkEmail = await userService.fetchUserByEmail(
                    existingEmail
                );
                // console.log(existingEmail, checkEmail)
                if (!checkEmail)
                    return GenerateResponse(
                        res,
                        400,
                        {},
                        "User does not exist"
                    );
            }
        }

        // DB Call to send the email
        const result = await emailService.sendEmail(email);

        return GenerateResponse(res, 201, result, "Email Sent");
    } catch (err: any) {
        if (String(process.env.DEBUG) === "TRUE") console.log(err);
        if (
            err.name === "ValidationError" ||
            err.name == "CastError" ||
            err.name == "BSONTypeError"
        )
            return GenerateResponse(res, 400, {}, "Wrong Input Format");
        return GenerateResponse(res, 500);
    }
};

export { SendEmail };
