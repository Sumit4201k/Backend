import { subscription } from "../models/subscriber.model.js";
import { User } from "../models/user.model.js";
import { apierror } from "../utils/apierror.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncyHandler } from "../utils/asyncHandler.js";

const subscriber = asyncyHandler(async(req , res)=>{

    const user = await User.findById(req.user._id)
    
    if (!user) {
        throw new apierror(400,"user not  found in subscriber contoller")
    }

    const Channel = await User.findOne({username:req.params.username})


    if (!Channel) {
        throw new apierror(400," channel name is not found in url")
    }



    const subscriberData = subscription.create(
        {
            subscriber:user._id,
            channel:Channel._id
        }
    )

    return res.status(200)
    .json( new apiResponse(200,subscriberData,"subcribption model make sucess fully"))


})


const unsubscribe = asyncyHandler(async(req , res)=>{

    const Channel = req.params.username

     if (!Channel) {
        throw new apierror(400," channel name is not found in url")
    }


    const Channelname = await User.findOne({username:Channel})

    const subscriberId = req.user?._id

     if (!subscriberId) {
        throw new apierror(400,"user not  found in unsubscriber contoller")
    }

    const userUnsubscribing = subscription.findByIdAndDelete(
        {
            subscriber:subscriberId._id,
            channel:Channelname._id
        }
    )
    
     return res.status(200)
    .json( new apiResponse(200,subscriberData,"subcribption model make sucess fully"))
})

return res.status(200)
.json(new apiResponse(200,userUnsubscribing,"unsubscribed sucess fully"))

export {

    subscriber,
    unsubscribe
}