import { UserDto, UserSchemaDto } from "../dtos/user.dto";
import User from "../models/user.model";
import { Types } from "mongoose";

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
 * @param {string} email is the user email to be searched
 * @returns {Promise<UserSchemaDto>} returns the user document matching the 
 */
const fetchUserByEmail = async (email: string): Promise<UserSchemaDto | null> => {
  return await User.findOne({ email });
};

const fetchUserById = async (id: Types.ObjectId): Promise<UserSchemaDto | null> => {
  return await User.findById(id);
};

export { createUser, fetchUserByEmail, fetchUserById };
