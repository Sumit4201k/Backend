import { Router } from "express";
import { registerUser, loginUser, Userlogout } from "../controllers/User.js";
import { Upload } from "../middleware/multer.js";
import { varifyJwt } from "../middleware/auth.js";

const router = Router()



router.route("/register").post(
    Upload.fields([
        {                               /*middle ware injected here with upload
                                        multer file with fields that accepts
                                        array of objs ,name=the name of your file
                                        that is coming from your front end and the max count
                                        is the no of file */
            name:"avatar",          
            maxCount:1      
        },                              
        {
            name:"coverimage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(varifyJwt ,Userlogout)


export default router