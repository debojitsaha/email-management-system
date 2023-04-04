import { EmailDto, EmailSchemaDto } from "../dtos/email.dto";
import Email from "../models/email.model";

/**
 * sendEmail creates an email & returns it.
 *
 * @param {EmailDto} email is the email object to be created in db
 * @returns {Promise<EmailSchemaDto>} is the created Email document.
 */
const sendEmail = (email: EmailDto): Promise<EmailSchemaDto> => {
    return Email.create(email);
};

export { sendEmail };
