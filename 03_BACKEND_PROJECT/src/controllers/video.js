import { Uploadvideo } from "../utils/cloudinary.js";
import { asyncyHandler } from "../utils/asyncHandler.js";
import {apierror} from "../utils/apierror.js";
import { apiResponse } from "../utils/apiResponse.js";
import { video } from "../models/video.model.js";
import cloudinary from "cloudinary";

const publishVideo = asyncyHandler(async (req, res) => {

    //  extract title and description from body
    const { title, description } = req.body;

    if (!title || !description) {
        throw new apierror(400, "Title and description are required");
    }

    //  extract owner from logged in user
    const owner = req.user?._id;

    //  extract local video path
    const videoLocalPath = req.file?.path;

    if (!videoLocalPath) {
        throw new apierror(400, "Video file is required");
    }
    // upload video to cloudinary
    const uploadResult = await Uploadvideo(videoLocalPath);

    if (!uploadResult) {
        throw new apierror(500, "Video upload failed");
    }

    //  extract video url
    const videoUrl = uploadResult.secure_url;

    //  extract duration
    const duration = uploadResult.duration;

    // generate thumbnail
    const thumbnail = cloudinary.url(uploadResult.public_id, {
        resource_type: "video",
        format: "jpg",
        transformation: [
            {
                width: 480,
                height: 360,
                crop: "fill"
            }
        ]
    });

    // create video document in DB
    const video = await video.create({

        videoFile: videoUrl,
        thumbnail: thumbnail,
        duration: duration,
        title: title,
        description: description,
        owner: owner

    });

    //  send response
    return res.status(201).json(
        new apiResponse(
            201,
            video,
            "Video published successfully"
        )
    );

});

export { publishVideo };