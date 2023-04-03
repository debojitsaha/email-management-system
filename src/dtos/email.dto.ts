import { Document } from "mongoose";

type EmailDto = {
    sender: string;
    reciever: string;
    subject: string;
    cc: Array<string>;
    bcc: Array<string>;
    contents: string;
    attachments: string;
    archived: Array<Object>;
};

type EmailSchemaDto = EmailDto & Document;

export { EmailDto, EmailSchemaDto };
