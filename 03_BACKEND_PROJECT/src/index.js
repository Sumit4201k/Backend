// require('dotenv').config({path:'./env'})
// this code can be run too but just for sake of 
// consistency we are gonna use another approach

import Dotenv from 'dotenv'
import { conncectDB } from "./db/index.js";
import { app } from './app.js';

Dotenv.config(
    {
        path:'./env'
    }
)




conncectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000,()=>{

        console.log("DATABASE CONNECTED!!!")
    })}
    
)
.catch((err)=>{
    console.log("Database connection error",err);
    
})