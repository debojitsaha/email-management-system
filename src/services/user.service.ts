import { UserDto } from "../dtos/user.dto";
import User from "../models/user.model";

const createUser = async (user: UserDto) => {
  try {
    const newUser = await User.create({
      name: user.name,
      email: user.email,
      password: user.password,
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
