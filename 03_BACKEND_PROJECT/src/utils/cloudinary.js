import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
     // Configuration
    
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
    
})


const UploadFile =async (Localfile) => {
   
     try {
        if (!Localfile) return null
        
       const CLoudupload=await cloudinary.uploader.upload(Localfile,{
            resource_type:"auto"
        })
        //clodinary is used here
        console.log("file uploaded scsfuly ",CLoudupload.url);
        console.log("CLODINERY RES:  ",CLoudupload);
        
        fs.unlinkSync(Localfile)
        return CLoudupload
     } catch (error) {
        fs.unlinkSync(Localfile)//remove locally uploaded file 
     }
}


const Uploadvideo =async (Localfile) => {
   
     try {
        if (!Localfile) return null
        
       const videoCLoudupload=await cloudinary.uploader.upload(Localfile,{
            resource_type:"video"
        })
        //clodinary is used here
        console.log("video uploaded scsfuly ",CLoudupload.url);
        console.log("CLODINERY RES:  ",CLoudupload);
        
        fs.unlinkSync(Localfile)
        return videoCLoudupload
     } catch (error) {
        fs.unlinkSync(Localfile)//remove locally uploaded file 
     }
}




// const DeleteFile = async (publicId) => {
//     try {

//         const result = await cloudinary.uploader.destroy(publicId)

//         return result

//     } catch (error) {
//         console.log("Error deleting file:", error)
//         return null
//     }
// }

// export {UploadFile , DeleteFile
// }


