import { privateKey } from "../../../config/config.service.js";
import { verifyToken } from "../utilis/token.service.js";
import * as db_services from "../../DB/db.services.js"
import userModel from "../../DB/models/user.Model.js";


export const authontication = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error("token required");
    }

    const decoded = verifyToken({
        token: authorization.split(" ")[1],
        secretKey: privateKey
    })

    if (!decoded) {
        throw new Error("invalid token")
    }

    const user = await db_services.findOneSelect({
        model: userModel,
        filter: { _id: decoded.id },
        fields: "-password"
    });


    if (!user) {
        throw new Error("user not found", { cause: 400 })
    }
    req.user = user

    next();
}