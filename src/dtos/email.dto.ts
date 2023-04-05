import { Document, Types } from "mongoose";
import { PaginationDto } from "./paginated.dto";

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

interface UpdateEmailDto
    extends Partial<Omit<EmailDto, "sender receiver cc bcc">> {}

type EmailSchemaDto = EmailDto & Document;

type EmailPaginationDto = {
    emails: EmailSchemaDto[];
} & PaginationDto;

export { EmailDto, EmailSchemaDto, UpdateEmailDto, EmailPaginationDto };
