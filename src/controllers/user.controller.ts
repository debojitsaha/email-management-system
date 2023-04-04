import { Request, Response } from "express";
import { UpdateUserDto, UserDto, UserSchemaDto } from "../dtos/user.dto";
import * as userService from "../services/user.service";
import { GenerateResponse } from "../utils/response.creator";
import bcrypt from "bcryptjs";
import { SendOTP } from "../config/twilio.config";
import { Types } from "mongoose";
var jwt = require("jsonwebtoken");

/**
 * Controller to create a new user with unique email generation by the system after OTP verification.
 *
 * @param {Request} req express request interface
 * @param {Response} res express response interface
 * @returns {Promise<Response>} returns status code 201, user created & a message.
 */
const CreateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user: UserDto = { ...req.body };

        // otp generation & sending to User's phone
        const otp = Math.floor(Math.random() * 1000000) + 1;
        user.otp = String(otp);

        // Unique email generation
        const count = await userService.countNames(user.name);
        let email = user.name.split(" ").join(".") + "@mindwebs.com";
        email = email.toLowerCase();
        // console.log(count);
        if (count > 0) {
            email = user.name.split(" ").join(".") + count + "@mindwebs.com";
            email = email.toLowerCase();
        }
        user.email = email;

        //DB Call to create new user.
        const result = await userService.createUser(user);

        await SendOTP(String(otp), user.phone);

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
 * Controller to verify the phone of a user by the OTP sent in CreateUser.
 *
 * @param {Request} req express request interface
 * @param {Response} res express response interface
 * @returns {Promise<Response>} returns status code 201, update user & a message.
 */
const VerifyPhone = async (req: Request, res: Response): Promise<Response> => {
    try {
        // const { userId } = req.params;
        const { userId, otp } = req.body;

        const user: UserSchemaDto | null = await userService.fetchUserById(
            new Types.ObjectId(userId)
        );

        if (!user)
            return GenerateResponse(res, 403, {}, "User does not exists");

        if (otp !== user.otp)
            return GenerateResponse(res, 401, {}, "Invalid OTP");

        const updateUserDto: UpdateUserDto = {
            otp: "",
            isPhoneVerified: true,
        };

        const updateUser = await userService.updateUserById(
            new Types.ObjectId(userId),
            updateUserDto
        );

        return GenerateResponse(
            res,
            201,
            updateUser,
            "Phone Verification Successful"
        );
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
 * @returns {Promise<Response>} returns status code 201, Authentication Token & a message.
 */
const LoginUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const credentials: UserDto = { ...req.body };

        // db call to get the details of already existing user.
        const result = await userService.fetchUserByEmail(credentials.email);
        // check if such user exists.
        if (!result)
            return GenerateResponse(res, 400, {}, "User does not exist");

        // check if User is verified
        if (!result.isPhoneVerified)
            return GenerateResponse(res, 400, {}, "User not verified");

        // checking the password
        const passwordMatched = await bcrypt.compare(
            credentials.password,
            String(result.password)
        );
        if (!passwordMatched)
            return GenerateResponse(res, 400, {}, "Invalid Credentials");

        // generate authentication token
        const jwtPayLoad = { id: result._id };
        const authToken = await jwt.sign(
            jwtPayLoad,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "2 days",
            }
        );

        return GenerateResponse(res, 201, { authToken }, "Login Successful");
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

export { CreateUser, VerifyPhone, LoginUser };
