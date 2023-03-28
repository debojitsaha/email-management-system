import { UpdateUserDto, UserDto, UserSchemaDto } from "../dtos/user.dto";
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
 * fetchUserByEmail service returns an existing user with this email id if any else null.
 *
 * @param {string} email is the user email to be searched
 * @returns {Promise<UserSchemaDto>} returns the user document matching the.
 */
const fetchUserByEmail = async (email: string): Promise<UserSchemaDto | null> => {
  return await User.findOne({ email });
};

/**
 * fetchUserById service finds an user with following id.
 * @param {Types.ObjectId} id is the user._id
 * @returns {Promise<UserSchemaDto} returns the user document matching the.
 */
const fetchUserById = async (id: Types.ObjectId): Promise<UserSchemaDto | null> => {
  return await User.findById(id);
};

const updateUserById = async(id: Types.ObjectId, user: UpdateUserDto): Promise<UserSchemaDto | null> =>{
  return await User.findByIdAndUpdate({_id: id},user)
}

export { createUser, fetchUserByEmail, fetchUserById, updateUserById };
