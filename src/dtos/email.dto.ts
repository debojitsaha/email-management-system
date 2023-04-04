import { Document, Types } from "mongoose";

type EmailDto = {
    sender: string;
    receiver: string;
    subject: string;
    cc: Array<string>;
    bcc: Array<string>;
    contents: string;
    attachments: string;
    archived: Types.ObjectId[];
};

interface UpdateEmailDto extends Partial<Omit<EmailDto, "sender receiver cc bcc">> {}

type EmailSchemaDto = EmailDto & Document;

export { EmailDto, EmailSchemaDto, UpdateEmailDto };
