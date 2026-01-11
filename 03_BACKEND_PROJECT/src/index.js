// require('dotenv').config({path:'./env'})
// this code can be run too but just for sake of 
// consistency we are gonna use another approach

import Dotenv from 'dotenv'
import { conncectDB } from "./db/index.js";

Dotenv.config(
    {
        path:'./env'
    }
)




conncectDB()