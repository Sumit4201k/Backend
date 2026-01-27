import { asyncyHandler } from "../utils/asyncHandler.js";

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


        const{fullName,email,username,password}=req.body()//when data is coming from bod(from form,json)
        console.log("email",email);
        
    res.status(200).json({
        message:"User server is working"
    })
})

export default registerUser