import { Router } from "express"
import * as UR from "./user.services.js"


export const userRouter = Router();

userRouter.post('/sign-up', UR.signUp);
userRouter.post('/sign-in', UR.signIn);

userRouter.get("/", UR.getAllUsers);



