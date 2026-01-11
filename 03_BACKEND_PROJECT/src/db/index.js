import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"


const conncectDB = async ()=>{

    try {
       const Connectioninstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        //mongoose gives you a return object that you can store in a variable 

        console.log(`MONGODB connected ${Connectioninstance.connection.host}`);
        //jusst to know which host i am connected to
    } catch (error) {
        
        console.log("MONGODB connection ERROR", error);
        process.exit(1)
        //exit 1 makes the process exit quickly as possible 
        //to continiue next asnc task
        
    }
}

export {conncectDB}