import { Document, Types } from "mongoose";

type UserDto = {
    name: string;
    email: string;
    password: string;
    dob: string;
    age: string;
    sex: string;
    phone: string;
    country: string;
    otp: string;
    isPhoneVerified: boolean;
};

interface UpdateUserDto extends Partial<Omit<UserDto, "password">> {}

type UserSchemaDto = UserDto & Document;

export { UserDto, UserSchemaDto, UpdateUserDto };
