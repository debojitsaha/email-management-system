import { model, Model, Schema, Types } from "mongoose";
import { UserSchemaDto } from "../dtos/user.dto";

const userSchema: Schema<UserSchemaDto> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<UserSchemaDto> = model("User", userSchema);

export default User;
