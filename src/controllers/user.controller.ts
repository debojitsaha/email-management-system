import { Request, Response } from "express";
import { UserDto } from "../dtos/user.dto";
import { createUser } from "../services/user.service";
import { GenerateResponse } from "../utils/response.creator";

const CreateUser = async (req: Request, res: Response): Promise<Response> => {
  const user: UserDto = { ...req.body };
  const { code, result = null, message } = await createUser(user);

  return GenerateResponse(res, code, result, message);
};

export { CreateUser };
