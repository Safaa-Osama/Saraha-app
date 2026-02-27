import joi from "joi";
import { genderEnum, providerEnum } from "../../common/enum/user.enum.js";


export const signUpSchema = {
    body: joi.object({
        firstName: joi.string().min(3).max(30).required(),
        lastName: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        cpassword: joi.string().valid(joi.ref("password")),
        age: joi.number().min(20).max(60),
        phone: joi.string(),
        provider: joi.string().valid(providerEnum.system, providerEnum.google),
        gender: joi.string().valid(...Object.values(genderEnum)).required(),
        profilePicture: joi.string()
    })
}

export const signInSchema = {
    body: joi.object({
       email: joi.string().email().required(),
        password: joi.string().min(6).required()
    })
}