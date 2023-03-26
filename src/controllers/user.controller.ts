import { Request, Response } from "express";
import { UserDto } from "../dtos/user.dto";
import { createUser } from "../services/user.service";
import { GenerateResponse } from "../utils/response.creator";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
var uniqueSlug = require("unique-slug");

/**
 * Controller to create a new user with unique email generation by the system after OTP verification.
 *
 * @param {Request} req express request interface
 * @param {Response} res express response interface
 * @returns {any} returns status code 201, the data recieved from the service & a message.
 */
const CreateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user: UserDto = { ...req.body };

    // Unique email generation
    var randomSlug = uniqueSlug();
    // console.log(randomSlug);

    let email = user.name.split(" ").join(".") + randomSlug + "@mindwebs.com";

    const fetchUserEmail = await User.findOne({ email: email });
    if (fetchUserEmail) {
      randomSlug = uniqueSlug("mindwebs@ems@3.0");
      email = user.name.split(" ").join(".") + randomSlug + "@mindwebs.com";
    }

    email = email.toLowerCase();
    user.email = email;

    // Hashed password generation
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(user.password, salt);
    user.password = secPass;

    //DB Call to create new user.
    const result = await createUser(user);

    return GenerateResponse(res, 201, result, "OK");
  } catch (err: any) {
    if (String(process.env.DEBUG) === "TRUE") console.log(err);
    if (
      err.name === "ValidationError" ||
      err.name == "CastError" ||
      err.name == "BSONTypeError"
    )
      return GenerateResponse(res, 400, {}, "Wrong Input Format");
    return GenerateResponse(res, 500);
  }
};

export { CreateUser };
