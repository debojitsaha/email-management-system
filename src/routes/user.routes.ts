import {Router} from 'express'
import { CreateUser } from '../controllers/user.controller'

const userRouter: Router= Router()

userRouter.post('/create',CreateUser)

export default userRouter