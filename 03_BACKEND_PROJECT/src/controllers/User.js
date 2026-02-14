import { asyncyHandler } from "../utils/asyncHandler.js";
import {apierror} from "../utils/apierror.js"
import {User} from '../models/user.model.js'
import {UploadFile} from '../utils/cloudinary.js'
import {apiResponse} from '../utils/apiResponse.js'
import jwt  from "jsonwebtoken";


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


const newAccestoken = asyncyHandler(async(req,res)=>{

    const IncomingRefToken = req.cookies.RefreshTocken || req.body.RefreshTocken //REFRESHTOKEN IS LONGLIVED
    // we are getting Encoded token here we need to decoded 

   try {
     if (!IncomingRefToken) {
         throw new apierror(400,"problem in incoming ref tocken")
     }
      
     const DecodedToken = jwt.verify(IncomingRefToken , process.env.REFRESH_TOKEN)
     //Token decoded here
 
     const user = await User.findById( DecodedToken?._id)
 
     if (!user) {
         throw new apierror(400,"problem in user ref tocken")
     }
 
     if ( IncomingRefToken !== user?.refreshTocken) //ref token name from the mopdel that is saved in database
         {
         throw new apierror(400, "Incomingref and userref is not matched")
     }
 
     const {newRefreshTocken , AccesTocken } = await generateAccestockenandRefreshtocken(user._id)
     //NEW REF TOKEN GENERATED HERE AND DESTRUCT 
 
     const option = {
     httpOnly:true,
     secure:false
    }
 
     return res.status(200)
     .cookie("RefreshToken",newRefreshTocken,option)
     .cookie("AccesToken",AccesTocken,option)
     .json(
         new apiResponse(
             200,
             {AccesTocken,newRefreshTocken},
             "Acess token refreshed"
         )
     )
   } catch (error) {
    throw new apierror(401 , error?.message,"newACESStoken error")
   }

})

const changeCurrentPassword = asyncyHandler(async(req,res)=>{
    const {oldPasword , newPassword} = req.body

    const user = User.findById(req.user?._id)

    const isOldPasswordcorect = user.isPasswordcorrect(oldPasword)

    if (!isOldPasswordcorect) {
        throw new apierror(400,"OLD PASSWORD IS NOT CORRECT")

    }

    user.password = newPassword 
    await user.save({validateBeforeSave:false})

    return res.status(200)
    .json(
         new apiResponse (200,{},"PASSWORD RESET SUCCESSFULLY")
    )

})

const getCurrentUser = asyncyHandler(async(req,res)=>{

    return res.status(200)
    .json( 
        new apiResponse(200,req.user,"CURRENT USER FETCHED SUCESSFULLY")
     )
})


const updateAccountdetails = asyncyHandler(async (req,res)=>{

    const {Fullname , Email } = req.body

    if (!Fullname || ! Email ) {
        throw new apierror(400 , " EMAIL and FULLNAMES are rqired")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                Fullname:Fullname,
                Email:Email
            }
        },
        {new:true}
    
    ).select("-password ")

    return res.status(200)
    .json(new apiResponse(200,user,"ACCOUNT DETAILS UPDATED SUCESSFULLY"))

})

const avatarUpdate = asyncyHandler(async(req , res )=>{

    const avatarlocalPath = req.file?.path

    if (!avatarlocalPath) {
        
        throw new apierror(400 , "AVATAR file is missig")
    }

    const avatar = await UploadFile(avatarlocalPath)

    if (!avatar.url) {
        throw new apierror(400,"ERROR WHILE UPLOADING")
    }

   const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{

                avatar:avatar.url
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res.status(200)
    .json( new apiResponse( 200 , user , "VATAR UPDATED SUCESS FULLY" ))
})


const coverimageUpdate = asyncyHandler(async(req , res )=>{

    const coverimagelocalPath = req.file?.path

    if (!coverimagelocalPath) {
        
        throw new apierror(400 , " coverimage file is missig")
    }

    const coverimage = await UploadFile(coverimagelocalPath)

    if (!coverimage.url) {
        throw new apierror(400,"ERROR WHILE UPLOADING")
    }

   const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{

                coverimage:coverimage.url
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res.status(200)
    .json( new apiResponse( 200 , user , "COVERIMAGE UPDATED SUCESS FULLY" ))
})

const getUserChannelProfile =  asyncyHandler(async ( req , res) =>{

   const {username} = req.params

   if (!username?.trim()) {
        throw new apierror(400, "USERNAME is not in params")
   }

   const channel = await User.aggregate([
    {
        $match: {

           username: username?.toLowerCase()// we got a single document here we need to look up in basis of this doc

        } 
    },
    {
        $lookup:{
            from:"subscriptions",//we gonna get value from this document
            localField:"_id",//
            foreignField:"channel",//
            as:"subscribers"// we got subscribers from here matchig channels
        }
    },
    {
        $lookup:{
            from:"subscriptions",//
            localField:"_id",//
            foreignField:"subscriber",//
            as:"subscribedTo"// got how many channle user subscribed by matching the user(subscriber in chanles)
        }
    },
    {
        $addFields:{                //added new feilds here
            subscribersCount:{
                $size:"$subscribers"// calculated subscribers by matching obj we got wth same channle
            },
            subscribedToCount:{
                $size:"$subscribedTo"// by matching user we got in each channle
            },
            isSubscribed:{
                $cond:{ /* we need to check if i am in the document called subscribers */
                    if:{$in: [req.user?._id , "$subscribers.subscribers"]},
                    then:true,
                    else:false
                    /* IN:checks if we are in the document both in array and obj
                REQ.USER:if u are logged in u have req user and can get the id from it
                "$ . ":-in sebscriber feild go in subscriber obj (in sub model) and check
                IF REQ.user if is in it */
                }
            }
        }
    },
    {
        $project:{
            Fullname:1,
            username:1,
            subscribersCount:1,
            subscribedToCount:1,
            isSubscribed:1,
            avatar:1,
            coverimage:1,
            Email:1

        }
    }
   ])

   if (!channel?.length) {
    throw new apierror(400,"channle does not exist")
   } 

   console.log("THE DATA OF CHANNLE:  ",channel);
   
   return res
   .status(200)
   .json(
    new apiResponse(200 ,channel[0],"User channle found")
   )

})


export {
    registerUser,
    loginUser,
    Userlogout,
    newAccestoken ,
    changeCurrentPassword,
    getCurrentUser ,
    updateAccountdetails,
    avatarUpdate,
    coverimageUpdate,
    getUserChannelProfile
}