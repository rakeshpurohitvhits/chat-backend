import express from 'express'
import { userList, userLogin, userRegistration } from '../../controller/userController/user.controller.js'
import { uploads } from '../../middleware/ImageUpload.js'

export const userRouter =express.Router()


userRouter.post('/sign-up',uploads.single("profileImage"),userRegistration)
userRouter.post('/login',userLogin)
userRouter.get('/user-list',userList)
