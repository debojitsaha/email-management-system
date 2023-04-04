import { Document, Types } from "mongoose";

type EmailDto = {
    sender: string;
    receiver: string;
    subject: string;
    cc: Array<string>;
    bcc: Array<string>;
    contents: string;
    attachments: string;
    archived: ArchiveDto[];
};

type ArchiveDto = {
    user: Types.ObjectId;
}

type EmailSchemaDto = EmailDto & Document;
type ArchiveSchemaDto = ArchiveDto & Document;

export { EmailDto, EmailSchemaDto, ArchiveDto, ArchiveSchemaDto };
