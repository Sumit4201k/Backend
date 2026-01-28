import { asyncyHandler } from "../utils/asyncHandler.js";
import {apierror} from "../utils/apierror.js"
import {User} from '../models/user.model.js'

const registerUser = asyncyHandler(async (req,res)=>{
    //step to make user
        //get user detail from fronend
        //validate that resposnse
        //check if user already exist
        //check if we have files(avtarimage)
        //upload them to cloudinary
        //create user obj(why=beacuse mongodb is no sql data base )with creation call in data base
        //remove pass and ref token feild from response
        //check if resposnse is there user creation
        //return res


        const{Fullname,Email,username,password}=req.body//when data is coming from bod(from form,json)
        console.log("email",Email);

        // if (Fullname === "") {
        //     throw new apierror(400,"full name is required")
        // }
//FIRST STEP VALIDATAION

        if (
            [Fullname,Email,username,password].some((feild)=>feild?.trim()==="")
                
            
        ) {
            throw new apierror(400,"all fields are neccecary")
        }


//SECOND STEP IF USER EXISTS
       const Existeduser = User.findOne({
            $or:[ {username} , {Email} ]
        })  //returns the first match

        if (Existeduser) {
            throw new apierror(400,"username and email already exist")
        }

//THIRD STEP TAKE AVATAR AND COVER IMAGE
        
    res.status(200).json({
        message:"User server is working"
    })
})

export default registerUser