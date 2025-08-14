import mongoose, {isValidObjectId} from "mongoose"
import asyncHandler from "../utils/asyncHandler.js"
import {Like} from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO : toggle like on video
});
const toggleCommentLike  = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    //TODO : toggle like on comment
});

const toggleTweetLike  = asyncHandler(async (req, res) => {
    const tweetId = req.params;
    //TODO : toggle like on tweet
});

const getLikedVideo  = asyncHandler(async (req, res) => {
    //TODO : toggle like on video
});

export { toggleVideoLike }