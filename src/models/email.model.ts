import { model, Model, Schema } from "mongoose";
import { EmailSchemaDto } from "../dtos/email.dto";

const emailSchema: Schema<EmailSchemaDto> = new Schema(
    {
        sender: {
            type: String,
            required: true,
        },
        reciever: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        cc: [{
            type: String,
        }],
        bcc: [{
            type: String,
        }],
        contents: {
            type: String,
            required: true,
        },
        attachments: {
            type: String,
        },
        archived: [{
            type: Object,
        }],
    },
    {
        timestamps: true,
    }
);

const Email: Model<EmailSchemaDto> = model("Email", emailSchema);

export default Email;
