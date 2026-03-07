import {  Router } from "express";
import { varifyJwt } from "../middleware/auth.js";
import { subscriber } from "../controllers/subscriber.js";

const router = Router()


router.route("/subscribe/:channelname").post(varifyJwt,subscriber)

export default router