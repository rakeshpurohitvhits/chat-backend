import bcrypt from 'bcryptjs' 
import jwt from "jsonwebtoken"
import admin from 'firebase-admin';

export const encryptPassword=async(password)=>{
 const salt= await bcrypt.genSalt(10)
 const encryptPassword=bcrypt.hash(password,salt)
 return encryptPassword
}


export const jwtCreate=async(payload)=>{
    const token=jwt.sign(payload,process.env.SECRET_KEY)
    return token
}


export const SendPushNotification = async (title, body, deviceToken) => {
    const message = {
        notification: { title, body },
        token: deviceToken,
    };
    return await admin.messaging().send(message);
};
