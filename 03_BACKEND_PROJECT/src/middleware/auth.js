import { User } from "../models/user.model";
import { apierror } from "../utils/apierror";
import { asyncyHandler } from "../utils/asyncHandler";
import  Jwt  from "jsonwebtoken";

export const varifyJwt = asyncyHandler(async(req, _,next)=>{

  try {
      //REQUEST have cookie acccces 
      // that is coming from user module because 
      // the midle ware used in app.js file called cookie praser
     const Tocken = req.cookie?.acessTocken || req.header("Authorization")?.replace("Bearer ","") 
       //Authorization: Bearer <token>
       //   (this is used in mobile cookie while givig tocken) 
  
      if (!Tocken) {
          throw new apierror(401,"error in auth")
      }
  
      const DecodedTocken =  Jwt.verify(Tocken,process.env.ACESS_TOKEN_SECRET)
      /* TOCKEN:- the info or the encoded tocken
      can only be decoded with acess tocken secret  */
  
     const user = await User.findById(DecodedTocken?._id).select("-pasword -refreshTocken")
  
      if (!user) {
          throw new apierror(401,"invalid user ")
      }
  
      req.user = user;
  
      next()
  }
  
  
  catch (error) {

    throw new apierror(401,error.message || "error in authorization")
    
  }

})