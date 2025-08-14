import mongoose, {isValidObjectId} from "mongoose"
import asyncHandler from "../utils/asyncHandler.js"
import {Playlist} from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APiResponse.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    //TODO : create playlist
});

const getUserPlaylist = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    //TODO : get user playlist
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    //TODO : get playist by id
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    //TODO : add playlist
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
   const {playlistId, videoId} = req.params;
    //TODO : remove video from playlist
});

const deletePlaylist  = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    //TODO : delete playist
});

const updatePlaylist  = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    const {name, description} = req.body;
    //TODO : update playlist
});

export { createPlaylist }