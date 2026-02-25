import {  Router } from "express";
import { varifyJwt } from "../middleware/auth";
import { subscriber } from "../controllers/subscriber";

const router = Router()


router.route("/subscribe/:channelname").post(varifyJwt,subscriber)

export {router}