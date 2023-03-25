import { UserDto } from "../dtos/user.dto";
import User from "../models/user.model";
var uniqueSlug = require("unique-slug");
import bcrypt from "bcryptjs";
const twilio = require("twilio");

const createUser = async (user: UserDto) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = require("twilio")(accountSid, authToken);

    client.verify.v2
      .services(accountSid)
      .verifications.create({ to: user.phone, channel: "sms" })
      .then((verification: any) => console.log(verification.sid));

    var randomSlug = uniqueSlug();
    // console.log(randomSlug);

    let email = user.name.split(" ").join(".") + randomSlug + "@mindwebs.com";

    const fetchUserEmail = await User.findOne({ email: email });
    if (fetchUserEmail) {
      randomSlug = uniqueSlug("mindwebs@ems@3.0");
      email = user.name.split(" ").join(".") + randomSlug + "@mindwebs.com";
    }

    email = email.toLowerCase();

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(user.password, salt);

    const newUser = await User.create({
      name: user.name,
      email: email,
      password: secPass,
      dob: user.dob,
      age: user.age,
      sex: user.sex,
      phone: user.phone,
      country: user.country,
    });

    return { code: 201, result: newUser, message: "OK" };
  } catch (err: any) {
    if (String(process.env.DEBUG) === "TRUE") console.log(err);
    if (err.name === "ValidationError")
      return { code: 400, message: "Wrong Input Format" };
    return { code: 500, message: "Internal Server Error" };
  }
};

export { createUser };
