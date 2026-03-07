import { Router } from "express";
import { publishVideo } from "../controllers/video.js";
import { varifyJwt } from "../middleware/auth.js";
import { Upload } from "../middleware/multer.js";

const router = Router();

// publish video route
router.route("/videoUpload/publish").post(varifyJwt,Upload.single("video"), publishVideo);

export default router;