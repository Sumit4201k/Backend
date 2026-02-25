import { Router } from "express";
import { publishVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// publish video route
router.route("/videoUpload/publish").post(verifyJWT,upload.single("video"), publishVideo);

export default router;