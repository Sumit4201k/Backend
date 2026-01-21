import { asyncyHandler } from "../utils/asyncHandler.js";

const registerUser = asyncyHandler(async (req,res)=>{
    res.status(200).json({
        message:"User server is working"
    })
})

export default registerUser