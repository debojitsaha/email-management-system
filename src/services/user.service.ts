import { UserDto, UserSchemaDto } from "../dtos/user.dto";
import User from "../models/user.model";

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

export { createUser };
