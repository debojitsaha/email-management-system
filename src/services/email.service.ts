import { Types } from "mongoose";
import { EmailDto, EmailSchemaDto, UpdateEmailDto } from "../dtos/email.dto";
import Email from "../models/email.model";

/**
 * sendEmail creates an email & returns it.
 *
 * @param {EmailDto} email is the email object to be created in db
 * @returns {Promise<EmailSchemaDto>} is the created Email document.
 */
const sendEmail = async (email: EmailDto): Promise<EmailSchemaDto> => {
    return Email.create(email);
};

/**
 * sentEmails finds all the mails sent by user by matching email with the sender field.
 * 
 * @param {string} email user's email
 * @returns {Promise<EmailSchemaDto[]>} is an array of all the Emails sent by user.
 */
const sentEmails = async (email: string): Promise<EmailSchemaDto[]> =>{
    return Email.find({sender:email});
}

/**
 * ccEmails finds all the mails recieved by user by matching email with the cc field.
 * 
 * @param {string} email user's email
 * @returns {Promise<EmailSchemaDto[]>} is an array of all the Emails received by user in cc.
 */
const ccEmails = async (email: string): Promise<EmailSchemaDto[]> =>{
    return Email.find({cc:email});
}

/**
 * bccEmails finds all the mails recieved by user by matching email with the bcc field.
 * 
 * @param {string} email user's email
 * @returns {Promise<EmailSchemaDto[]>} is an array of all the Emails received by user in bcc.
 */
const bccEmails = async (email: string): Promise<EmailSchemaDto[]> =>{
    return Email.find({bcc:email});
}

/**
 * inboxEmails finds all the mails recieved by user by matching email with the receiver field.
 * 
 * @param {string} email user's email
 * @returns {Promise<EmailSchemaDto[]>} is an array of all the Emails received by user as receiver.
 */
const inboxEmails = async (email: string): Promise<EmailSchemaDto[]> =>{
    return Email.find({receiver:email});
}

/**
 * fetchEmailById finds the email with the given id.
 * 
 * @param {Types.ObjectId} emailId of the email to find
 * @returns {Promise<EmailSchemaDto | null>} returns the Email document.
 */
const fetchEmailById = async(emailId: Types.ObjectId): Promise<EmailSchemaDto | null>=>{
    return Email.findById(emailId);
}

/**
 * updateEmailById finds the email with the given id & updates the given fields through email.
 * 
 * @param {Types.ObjectId} emailId of the email to find
 * @param {UpdateEmailDto} email of the email field's to be updated
 * @returns {Promise<EmailSchemaDto | null>} returns the updated Email document.
 */
const updateEmailById = async(id: Types.ObjectId, email:UpdateEmailDto): Promise<EmailSchemaDto | null>=>{
    return await Email.findByIdAndUpdate({ _id: id }, email, {
        returnDocument: "after",
    });
}

export { sendEmail, sentEmails, ccEmails, bccEmails, inboxEmails, fetchEmailById, updateEmailById };
