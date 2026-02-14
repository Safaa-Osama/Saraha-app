import userModel from "../../DB/models/user.Model.js";
import * as db_services from "../../DB/db.services.js"
import { decrypt, encrypt } from "../../common/utilis/security/crypto.security.js";
import jwt from "jsonwebtoken";
import { succesRresponse } from "../../common/utilis/response.success.js";
import { providerEnum } from "../../common/enum/user.enum.js";
import { compare, hash } from "../../common/utilis/security/hash.security.js";
import { privateKey } from "../../../config/config.service.js";
import { generateToken, verifyToken } from "../../common/utilis/token.service.js";
import { authontication } from "../../common/middleware/authontication.js";


export const signUp = async (req, res, next) => {
    const { firstName, lastName, email, password, cpassword, age, gender, phone } = req.body;

    if (password !== cpassword) {
        throw new Error("invalid password", { cause: 400 })
    }

    if (await db_services.findOne({
        model: userModel,
        filter: { email }
    })
    ) {
        throw new Error("Email already exist", { cause: 409 })
    }

    const user = await db_services.create({
        model: userModel,
        data: {
            firstName, lastName, email, age, gender,
            password: hash({ text: password }),
            phone: encrypt(phone)
        }
    });
    succesRresponse({ res, status: 201, data: user });
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await db_services.findOne({
        model: userModel,
        filter: { email, provider: providerEnum.system }
    })
    if (!user) {
        throw new Error(" user not exist ", { cause: 400 })
    }

    if (!(compare({ text: password, cipherTxt: user.password }))) {
        throw new Error("invalid password", { cause: 400 })
    }

    const privateKey = process.env.privateKey;
    let accessToken = generateToken({
        payload: {
            id: user._id,
            email: user.email,
            password: user.password,
        },
        secretKey: privateKey,
        option: { expiresIn: '1h' }
    })

    succesRresponse({ res, data: { userToken: accessToken, userdata: user } });

}

export const getAllUsers = async (req, res, next) => {
    const users = await db_services.findAll(userModel, "firstName lastName gender provider age")
    succesRresponse({ res, data: users });
}

export const getProfile = async (req, res, next) => {
  
    succesRresponse({ res, data: { ...req.user._doc, phone: decrypt(req.user.phone) } })
}


