import { Uploadvideo } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import cloudinary from "cloudinary";

const publishVideo = asyncHandler(async (req, res) => {

    //  extract title and description from body
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    //  extract owner from logged in user
    const owner = req.user?._id;

    //  extract local video path
    const videoLocalPath = req.file?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }
    // upload video to cloudinary
    const uploadResult = await Uploadvideo(videoLocalPath);

    if (!uploadResult) {
        throw new ApiError(500, "Video upload failed");
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
    const video = await Video.create({

        videoFile: videoUrl,
        thumbnail: thumbnail,
        duration: duration,
        title: title,
        description: description,
        owner: owner

    });

    //  send response
    return res.status(201).json(
        new ApiResponse(
            201,
            video,
            "Video published successfully"
        )
    );

});

export { publishVideo };