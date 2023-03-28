import { model, Model, Schema } from "mongoose";
import { UserSchemaDto } from "../dtos/user.dto";
import { genSaltSync, hashSync } from "bcryptjs";

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
    otp: {
      type: String
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  // Check if password was modified
  if (!this.isModified("password") || !this.isNew) {
      next();
  } else this.isModified("password");

  // if password was modified then hash it using bcrypt module by salting it 10x times
  if (this.isModified("password") && this.password) {
      const salt = genSaltSync(10);
      this.password = hashSync(this.password.toString(), salt);
  }
  next();
});

const User: Model<UserSchemaDto> = model("User", userSchema);

export default User;
