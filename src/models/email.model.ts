import { model, Model, Schema, Types } from "mongoose";
import { EmailSchemaDto } from "../dtos/email.dto";

const emailSchema: Schema<EmailSchemaDto> = new Schema(
    {
        sender: {
            type: String,
            required: true,
        },
        receiver: {
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
        archived: [{}],
    },
    {
        timestamps: true,
    }
);

const Email: Model<EmailSchemaDto> = model("Email", emailSchema);

export default Email;
