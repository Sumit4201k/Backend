import { asyncyHandler } from "../utils/asyncHandler.js";
import {apierror} from "../utils/apierror.js"
import {User} from '../models/user.model.js'
import {UploadFile} from '../utils/cloudinary.js'
import {apiResponse} from '../utils/apiResponse.js'


const generateAccestockenandRefreshtocken= async(userId)=>{

      try {
        const user = await User.findById(userId)

        const RefreshTocken = user.generateRefreshtoken()
       const AccesTocken =  user.generateAccesstoken()

       user.refreshTocken = RefreshTocken
       await user.save({validateBeforeSave:false})

        return {RefreshTocken , AccesTocken}

      } catch (error) {
        
        throw new apierror(400,"something wrong in ACCTKN and REFTKN fetching")
      }  
}

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
        console.log("req BODY:  ",req.body);
        
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
       const Existeduser =await User.findOne({
            $or:[ {username} , {Email} ]
        })  //returns the first match

        if (Existeduser) {
            throw new apierror(400,"username and email already exist")
        }

//THIRD STEP TAKE AVATAR AND COVER IMAGE
       const avatarLocal= req.files?.avatar[0]?.path      //files is from multer 
       let coverimageLocal      //files is from multer 

       if (req.files && Array.isArray(req.files.coverimage)  &&  req.files.coverimage.length > 0) {
        coverimageLocal = req.files.coverimage[0].path 
       }
       
        console.log("req FILES:  ",req.files);
        
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
//STEP SIXTH RESPOSE WITH THE USER



    res.status(200).json(
       new apiResponse(200,Createduser,"user created")
    )

    
})


//LOGIN


   


const loginUser=asyncyHandler(async (req,res)=>{
//get a req- body
//validate that response
// compare user with data
// compare pass
//give acccces token end ref tocken 
// give user details

const {Email,username,password}=req.body

    if (!username && !Email)
    // if (!(username || Email ))
        {
        throw new apierror(400,"username or password reqired ")
    }

    const user =await User.findOne({
        $or:[{username},{Email}] //$or operator is frm momgo DB data base
    })

    if (!user)//instace of user from data base
     {
        throw new apierror(400,"User not found")
    }

    /* the user here is THE INSTACE OF THE USER I GOT FROM 
    THE DATA BASE */
    const Userpassword  = await user.isPasswordcorrect(password)

    if (!Userpassword) {
        throw new apierror(400,"incorrect password")

    }

   const {RefreshTocken , AccesTocken } =await generateAccestockenandRefreshtocken(user._id)

   const logeddinUser = await User.findById(user._id).select(
    "-password -refreshTocken"
   )
  
   const option = {
    httpOnly:true,
    secure:false
   }

   return res
   .status(200)
   .cookie("AccesTocken",AccesTocken,option)
   .cookie("RefreshTocken",RefreshTocken,option)
   .json(
    new apiResponse(
        200,
        {
            user:logeddinUser, RefreshTocken, AccesTocken
        },
        "User logged in sucessfully"
    )
   )

})

const Userlogout = asyncyHandler( async (req,res) => {
      
    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                RefreshTocken:undefined

            }
        },
        {
            new:true
        }
    )

    const option = {
    httpOnly:true,
    secure:false
   }

   return res.status(200)
   .clearCookie("AccesTocken",option)
   .clearCookie("RefreshTocken",option)
   .json(
    new apiResponse(200,{},"user LOGGED OUT ")
   )

} )



export {registerUser,loginUser,Userlogout}