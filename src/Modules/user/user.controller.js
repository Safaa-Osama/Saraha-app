import { Router } from "express"
import * as UR from "./user.services.js"
import { authontication } from "../../common/middleware/authontication.js";


export const userRouter = Router();

userRouter.post('/sign-up', UR.signUp);
userRouter.post('/sign-in', UR.signIn);

userRouter.get("/", UR.getAllUsers);
userRouter.get("/profile", authontication,UR.getProfile);



