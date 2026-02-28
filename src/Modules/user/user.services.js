import userModel from "../../DB/models/user.Model.js";
import * as db_services from "../../DB/db.services.js"
import { decrypt, encrypt } from "../../common/utilis/security/crypto.security.js";
import { succesRresponse } from "../../common/utilis/response.success.js";
import { providerEnum } from "../../common/enum/user.enum.js";
import { compare, hash } from "../../common/utilis/security/hash.security.js";
import { generateToken } from "../../common/utilis/token.service.js";
import { OAuth2Client } from 'google-auth-library';
import { CLIENT_ID, PRIVATE_KEY } from "../../../config/config.service.js";


export const signUp = async (req, res, next) => {
    const { userName, email, password, cpassword, age, gender, phone } = req.body;

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
            userName, email, age, gender,
            password: hash({ text: password , salt_round:10}),
            phone: encrypt(phone)
        }
    });
    succesRresponse({ res, status: 201, data: user });
}

export const signUpWithGoogle = async (req, res, next) => {
    const { idToken } = req.body;

    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, email_verified, name, picture } = payload;

    let user = await db_services.findOne({ model: userModel, filter: { email } });

    if (!user) {
        const user_name = name.split(" ");

        const firstName = user_name[0];
        const lastName = user_name.slice(1).join(" ");
        user = await db_services.create({
            model: userModel,
            data: {
                email,
                confirmedEmail: email_verified,
                firstName, lastName,
                profilePicture: picture,
                provider: providerEnum.google
            }
        })
    }

    if (user.provider == providerEnum.system) {
        throw new Error("google")
    }

    const accessToken = generateToken({
        payload: {
            id: user._id, email: user.email
        },
        secretKey: PRIVATE_KEY,
        option: { expiresIn: '1h' }
    })

    succesRresponse({ res, data: { accessToken, user } })
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    let user = await db_services.findOne({
        model: userModel,
        filter: { email, provider: providerEnum.system }
    })
    if (!user) {
        throw new Error(" user not exist ", { cause: 400 })
    }

    if (!(compare({ text: password, cipherTxt: user.password }))) {
        throw new Error("invalid password", { cause: 400 })
    }

      user = await db_services.updateOne({
        model:userModel,
        filter: { _id: user._id },
        options:
            { $inc: { profileViews: 1 } },
        
    })


    let accessToken = generateToken({
        payload: {
            id: user._id,
            email: user.email,
        },
        secretKey: PRIVATE_KEY,
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


