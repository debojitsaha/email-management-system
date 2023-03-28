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
const fetchUserByEmail = async (
    email: string
): Promise<UserSchemaDto | null> => {
    return await User.findOne({ email });
};

/**
 * fetchUserById service finds an user with following id.
 * 
 * @param {Types.ObjectId} id is the user._id
 * @returns {Promise<UserSchemaDto>} returns the user document matching the id.
 */
const fetchUserById = async (
    id: Types.ObjectId
): Promise<UserSchemaDto | null> => {
    return await User.findById(id);
};

/**
 * updateUserById service finds an user with following id & updates it values.
 * 
 * @param {Types.ObjectId, UpdateUserDto} id is the user._id & user is the UpdateUserDto
 * @returns {Promise<UserSchemaDto>} returns the updated user document matching the id.
 */
const updateUserById = async (
    id: Types.ObjectId,
    user: UpdateUserDto
): Promise<UserSchemaDto | null> => {
    return await User.findByIdAndUpdate({ _id: id }, user);
};

/**
 * Counts the number of duplicate names of users in the document.
 * 
 * @param {string} name is the user.name
 * @returns {any} frequency of duplicate entries.
 */
const countNames = async (name: string) => {
    return await User.find({ name: name }).count();
};

export {
    createUser,
    fetchUserByEmail,
    fetchUserById,
    updateUserById,
    countNames,
};
