import userModel from "../../DB/models/user.Model.js";
import * as db_services from "../../DB/db.services.js"





export const signUp = async (req, res, next) => {
    const { firstName, lastName, email, password, gender , phone} = req.body;
   
    if (await db_services.findOne({
        model: userModel,
        filter: { email }
    })
    ) {
        return next(new Error("Email already exist"))
    }

    const user = await db_services.create({
        model: userModel,
        data: { firstName, lastName, email, password, gender ,phone}
    });
    res.status(201).json({ message: "done", user })

}

export const signIn = async (req, res, next) => {
    const {  email, password } = req.body;
 
    const user = await db_services.findOne({ 
       model:userModel,
        filter: {email}
     })
    if (!user) {
        return next(new Error("user not exist"))
    }
    if (password !== user.password) {
        return next(new Error("password not valid"))
    }
    res.status(200).json({ message: "done", user })

}

export const getAllUsers = async (req,res,next)=>{
    const users = await db_services.findAll(userModel);
    return res.status(200).json({message:"done", users})
}

