const asyncyHandler = (RequestHandler)=>{

  return  (req,res,next)=>{
        Promise.resolve(RequestHandler(req,res,next)).catch((error)=>next(error))
    }

}


export {asyncyHandler}


// const asyncyHandler = (fn )=>async(req,res,next )=>{

//     try {
//         await fn(res,req,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }