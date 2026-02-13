import { privateKey } from "../../../config/config.service.js";
import { verifyToken } from "../utilis/token.service.js";
import * as db_services from "../../DB/db.services.js"


export const authontication = async (req,res,next)=>{
const {authorization} = req.headers;

if (!authorization) {
    throw new Error( "token required" )
}

const decoded = verifyToken({
    token:authorization,
    secretKey:privateKey
})

if (!decoded) {
    throw new Error("invalid token")
}

 const user = await db_services.findOne({
        model: userModel,
        filter: { id:decoded.id },
        select: "-password"
    })

    req.user = user

    if (!user) {
        throw new Error("user not found", { cause: 400 })
    }

next();
}