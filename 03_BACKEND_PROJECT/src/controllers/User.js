import { asyncyHandler } from "../utils/asyncHandler.js";
import {apierror} from "../utils/apierror.js"
import {User} from '../models/user.model.js'
import {UploadFile} from '../utils/cloudinary.js'
import {apiResponse} from '../utils/apiResponse.js'

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
       const avatarLocal= req.files?.avatar[0]?.path      //files is from multer 
       const coverimageLocal= req.files?.coverimage[0]?.path      //files is from multer 

       if (!avatarLocal) {
        throw new apierror(400,"avatar is required")
       }

//STEP FOUR UPLOAD IN CLODINARY
     const avatar =  await UploadFile(avatarLocal)
     const Coverimage = await UploadFile(coverimageLocal)

     if (!avatar) {
        throw new apierror(400,"avatar is required")
     }

//STEPFIVE USER CREATION IN DATABASE
    const user= await User.create({
        Fullname,
        avatar: avatar.url,
        coverimage: Coverimage?.url || ""  ,//if there is a cover image then create else leave it empty
        Email,
        password,
        username:username.toLowerCase()
     })
//STEP FIVE OF REMOVING TTHE REF TOCKEN AND PASSSWORD
     const Createduser= await User.findById(user._id)
     /*select method is used to select
    feilds that we want (this mthd selects 
    all of the feilds we have to un slect the
    feild we dont want) by using - and space*/ 
     .select(
        "-password -refreshTocken"
    )
    if(!Createduser){
        throw new apierror(500,"server error while registring the user")
    }
//STEP SICTH RESPOSE WITH THE USER



    res.status(200).json(
       new apiResponse(200,Createduser,"user created")
    )

})

export default registerUser