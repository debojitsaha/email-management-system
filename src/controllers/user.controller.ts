import { Request, Response } from "express";
import { UserDto, UserSchemaDto } from "../dtos/user.dto";
import * as userService from "../services/user.service";
import { GenerateResponse } from "../utils/response.creator";
import bcrypt from "bcryptjs";
import { SendOTP } from "../config/twilio.config";
var uniqueSlug = require("unique-slug");
var jwt = require("jsonwebtoken");

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

    const fetchUserByEmail: UserSchemaDto | null = await userService.fetchUserByEmail(user.email);
    if (fetchUserByEmail) {
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
    const result = await userService.createUser(user);

    return GenerateResponse(res, 201, result, "Registration Successful");
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

/**
 * Controller to Login a user.
 *
 * @param {Request} req express request interface
 * @param {Response} res express response interface
 * @returns {any}
 */
const LoginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const credentials: UserDto = { ...req.body };

    // db call to get the details of already existing user.
    const result = await userService.fetchUserByEmail(credentials.email);
    // check if such user exists.
    if (!result) return GenerateResponse(res, 400, {}, "Invalid Credentials");

    // checking the password
    const passwordMatched = await bcrypt.compare(
      credentials.password,
      String(result.password)
    );
    if (!passwordMatched)
      return GenerateResponse(res, 400, {}, "Invalid Credentials");

    // generate authentication token
    const jwtPayLoad = { id: result._id };
    const authToken = await jwt.sign(jwtPayLoad, process.env.JWT_SECRET_KEY, {
      expiresIn: "2 days",
    });

    return GenerateResponse(res, 201, { authToken }, "Log In Successful");
  } catch (err: any) {
    if (String(process.env.DEBUG) === "TRUE") console.log(err);
    if (
      err.name === "ValidationError" ||
      err.name == "CastError" ||
      err.name == "BSONTypeError"
    )
      return GenerateResponse(res, 400, {}, "Invalid Credentials");
    return GenerateResponse(res, 500);
  }
};

export { CreateUser, LoginUser };
