import mongoose, {isValidObjectId} from "mongoose"
import asyncHandler from "../utils/asyncHandler.js"
import {Playlist} from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO : create tweet
});

const getUserTweets = asyncHandler(async (req, res) => {
    //TODO : get user tweet
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO : update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO : delete tweet
});
export {createTweet};