import { Router } from "express"
import * as US from "./user.services.js"
import { authontication } from "../../common/middleware/authontication.js";
import { joiValidator } from "../../common/middleware/joi.validator.js";
import * as UV from "./user.schema.js";
import { multer_local } from "../../common/middleware/multer.js";
import { multerEnum } from "../../common/enum/multer.enum.js";


export const userRouter = Router();

userRouter.get("/", US.getAllUsers);


userRouter.post('/sign-up', multer_local("useers", multerEnum.image).single("attachment"), US.signUp);
userRouter.post('/signup/gmail', US.signUpWithGoogle);

userRouter.post('/sign-in', joiValidator(UV.signInSchema),US.signIn);

userRouter.get("/profile", authontication, US.getProfile);



