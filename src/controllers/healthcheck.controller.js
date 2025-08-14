import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APiResponse.js";

const healthcheck = asyncHandler(async (req, res) => {
    //TODO : build a health response that simply return the OK status as json with a message
});

export { healthcheck }