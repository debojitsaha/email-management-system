import { UserDto, UserSchemaDto } from "../dtos/user.dto";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

/**
 * createUser service creates a newUser & returns it.
 *
 * @param {UserDto} user is the User object to be created in the db
 * @returns {Promise<UserSchemaDto>} is the created User document.
 */
const createUser = async (user: UserDto): Promise<UserSchemaDto> => {
  const newUser = await User.create(user);

  return newUser;
};

/**
 * login service returns an existing user if any else null.
 *
 * @param {UserDto} credentials is the User object present in db
 * @returns {any} returns an object.
 */
const login = async (credentials: UserDto) => {
  const existingUser = await User.findOne({ email: credentials.email });

  return existingUser;
};

export { createUser, login };
