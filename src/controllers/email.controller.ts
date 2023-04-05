import { Request, Response } from "express";
import { GenerateResponse } from "../utils/response.creator";
import {
    EmailDto,
    EmailPaginationDto,
    EmailSchemaDto,
    UpdateEmailDto,
} from "../dtos/email.dto";
import * as emailService from "../services/email.service";
import * as userService from "../services/user.service";
import { Types } from "mongoose";
import { UserSchemaDto } from "../dtos/user.dto";

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

/**
 * Controller to find all the mails sent by the user.
 *
 * @param {Request} req express request interface
 * @param {Response} res express response interface
 * @returns {Promise<Response>} returns an array of all the mails sent by the user.
 */
const SentEmails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId } = req.params;

        // default values for pagination
        const page: number = req.query.page ? Number(req.query.page) : 1;
        const limit: number = req.query.limit ? Number(req.query.limit) : 10;

        // fetch & check the user if exists.
        const user: UserSchemaDto | null = await userService.fetchUserById(
            new Types.ObjectId(userId)
        );

        if (!user) return GenerateResponse(res, 400, {}, "User does not exist");

        // DB call to find all the emails sent by user by matching the user's email with the sender field.
        const mails = await emailService.sentEmails(user.email);

        // slice the mails to given page and limit
        const paginatedMailes: EmailSchemaDto[] = mails.slice(
            (page - 1) * limit,
            page * limit
        );

        // Prepare paginated response data
        const data: EmailPaginationDto = {
            emails: paginatedMailes,
            hasNextPage: mails[page * limit] ? true : false,
            hasPrevPage: page > 1 ? true : false,
            limit,
            nextPage: mails[page * limit] ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            page,
            totalObjects: mails.length,
            totalPages: Math.ceil(mails.length / limit),
        };

        return GenerateResponse(res, 201, data, "Emails Sent by User");
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
/**
 * Controller to find all the mails received by the user.
 *
 * @param {Request} req express request interface
 * @param {Response} res express response interface
 * @returns {Promise<Response>} returns an array of all the mails received by the user.
 */
const InboxEmails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId } = req.params;

        // default values for pagination
        const page: number = req.query.page ? Number(req.query.page) : 1;
        const limit: number = req.query.limit ? Number(req.query.limit) : 10;

        // fetch & check the user if exists.
        const user: UserSchemaDto | null = await userService.fetchUserById(
            new Types.ObjectId(userId)
        );

        if (!user) return GenerateResponse(res, 400, {}, "User does not exist");

        // DB call to find all the emails sent by user by matching the user's email with the sender field.
        const inboxMails = await emailService.inboxEmails(user.email);
        const ccMails = await emailService.ccEmails(user.email);
        const bccMails = await emailService.bccEmails(user.email);
        const mails = inboxMails.concat(ccMails, bccMails);

        // slice the mails to given page and limit
        const paginatedMailes: EmailSchemaDto[] = mails.slice(
            (page - 1) * limit,
            page * limit
        );

        // Prepare paginated response data
        const data: EmailPaginationDto = {
            emails: paginatedMailes,
            hasNextPage: mails[page * limit] ? true : false,
            hasPrevPage: page > 1 ? true : false,
            limit,
            nextPage: mails[page * limit] ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
            page,
            totalObjects: mails.length,
            totalPages: Math.ceil(mails.length / limit),
        };

        return GenerateResponse(res, 201, data, "Emails Sent by User");
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

/**
 * Controller to archive the mail for a user.
 *
 * @param {Request} req express request interface
 * @param {Response} res express response interface
 * @returns {Promise<Response>} returns the updated Email document which the user archived.
 */
const ArchiveEmail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userId, emailId } = req.params;

        // check if the email exists
        const email = await emailService.fetchEmailById(
            new Types.ObjectId(emailId)
        );

        if (!email)
            return GenerateResponse(res, 400, {}, "Email does not exist");

        // append the user to archived field
        email.archived.push(new Types.ObjectId(userId));
        const updateEmailDto: UpdateEmailDto = {
            archived: email.archived,
        };

        // DB Call to update the archive field
        const updateEmail = await emailService.updateEmailById(
            email._id,
            updateEmailDto
        );

        return GenerateResponse(res, 201, updateEmail, "Email Archived");
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

/**
 * Controller to unarchive the mail for a user.
 *
 * @param {Request} req express request interface
 * @param {Response} res express response interface
 * @returns {Promise<Response>} returns the updated Email document which the user unarchived.
 */
const UnarchiveEmail = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { userId, emailId } = req.params;

        // check if the email exists
        const email = await emailService.fetchEmailById(
            new Types.ObjectId(emailId)
        );

        if (!email)
            return GenerateResponse(res, 400, {}, "Email does not exist");

        // remove the user from the archived field
        const archived = email.archived.filter((id) => {
            return String(id) != userId;
        });
        // console.log(archived);
        const updateEmailDto: UpdateEmailDto = {
            archived: archived,
        };

        // DB Call to update the archived field
        const updateEmail = await emailService.updateEmailById(
            email._id,
            updateEmailDto
        );

        return GenerateResponse(res, 201, updateEmail, "Email Unarchived");
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

export { SendEmail, SentEmails, InboxEmails, ArchiveEmail, UnarchiveEmail };
