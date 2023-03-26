import {Router} from 'express'
import { CreateUser, LoginUser } from '../controllers/user.controller'

const userRouter: Router= Router()

userRouter.post('/create',CreateUser)
userRouter.post('/login',LoginUser)

export default userRouter