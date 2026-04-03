import { StatusCodes } from "http-status-codes"
import { ResponseMessage } from "../../utils/ResponseMessage.js"
import { userModel } from "../../model/userModel/user.model.js"
import { encryptPassword, jwtCreate } from "../../services/services.js"
import bcrypt from 'bcryptjs'

export const userRegistration = async (req, res) => {
    console.log(req);
    try {
        const findData = await userModel.findOne({ mobileNumber: req.body.mobileNumber, email: req.body.email, isDelete: false })
        if (findData&&findData.email == req.body.email) {
            res.status(StatusCodes.BAD_REQUEST)
                .json({ data: [], status: StatusCodes.BAD_REQUEST, message: ResponseMessage.EMAIL_ALREADY_EXIST })
        }
        else if (findData&&findData.mobileNumber == req.body.mobileNumber) {
            res.status(StatusCodes.BAD_REQUEST)
                .json({ data: [], status: StatusCodes.BAD_REQUEST, message: ResponseMessage.MOBILE_ALREADY_EXIST })
        }
        else {
            const encryptPass = await encryptPassword(req.body.password)
            req.body.password = encryptPass
            req.body.profileImage=req?.file?.filename
            const savedData = await userModel.create(req.body)
           
            res.status(StatusCodes.CREATED)
                .json({ data: [], status: StatusCodes.CREATED, message: ResponseMessage.CREATE_USER })
        }
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ data: error, status: StatusCodes.INTERNAL_SERVER_ERROR, message: ResponseMessage.INTERNAL_SERVER })
    }
}


export const userLogin = async (req, res) => {
    try {
        const findData = await userModel.findOne({ email: req.body.email, isDelete: false })
        if (findData) {
            const matchPassword = await bcrypt.compare(req.body.password, findData.password);
            if (matchPassword) {

               await userModel.updateOne({_id:findData._id},{$set:{fcmToken:req.body.fcmToken}})
                const payload = {
                    user: {
                        id: findData._id
                    }
                }

                const token = await jwtCreate(payload)
                const { password, ...userData } = findData;
                return res.status(StatusCodes.OK).json({
                    status: StatusCodes.OK,
                    message: ResponseMessage.USER_LOGIN,
                    data: { ...userData._doc, token }
                });
            }
        }
        return res.status(StatusCodes.NOT_FOUND)
            .json({ data: [], status: StatusCodes.NOT_FOUND, message: ResponseMessage.INVALID_CREDENTIAL })
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ data: error, status: StatusCodes.INTERNAL_SERVER_ERROR, message: ResponseMessage.INTERNAL_SERVER })
    }
}

export const userList = async (req, res) => {
    try {
        const findData = await userModel.find({ isDelete: false })
        if (findData) {
                return res.status(StatusCodes.OK).json({
                    status: StatusCodes.OK,
                    message: ResponseMessage.USER_LOGIN,
                    data: findData
                });
            }
        return res.status(StatusCodes.NOT_FOUND)
            .json({ data: [], status: StatusCodes.NOT_FOUND, message: ResponseMessage.USER_NOT_FOUND })
    } catch (error) {
      
        res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ data: error, status: StatusCodes.INTERNAL_SERVER_ERROR, message: ResponseMessage.INTERNAL_SERVER })
    }
}