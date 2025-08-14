import mongoose from "mongoose";
import { Comment } from "../models/video.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APiResponse.js";

const getVIdeoComment = asyncHandler(async (req,res) =>{
    //TODO : get all comments for a video
    const { videoId} = req.params;
    const {page = 1, limit = 10} = req.query
});

const addComment = asyncHandler( async (req,res)=>{
    //TODO : add a comment to a video
})

const updateComment = asyncHandler( async (req,res)=>{
    //TODO : add a comment to a video
});

const deleteComment  = asyncHandler( async (req,res)=>{
    //TODO : delete a comment
})

export {};