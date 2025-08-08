import asyncHandler from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/APiResponse.js";
import { response } from "express";
import jwt from 'jsonwebtoken';
const generateAccessAndRefeshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, 'Something went wrong while login')
    }
}
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(422, "user with email or Username already exists")
    }
    console.log(req);
    const avatarLocalPath = req.files?.avatar[0]?.path


    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path;
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }
    return res.status(201,).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!(username || email)) {
            throw new ApiError(400, "username or email is required")
        }
        const user = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (!user) {
            throw new ApiError(404, "this user does not exist");
        }
        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials")
        }

        const { accessToken, refreshToken } = await generateAccessAndRefeshToken(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
            new ApiResponse(200,
                {
                    user: loggedInUser, accessToken, refreshToken,

                }
            )
        )
    } catch (error) {
        throw new ApiError(401, error)
    }
});
const logoutUser = asyncHandler(async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: undefined
                }
            }, {
            new: true
        }
        )
        const options = {
            httpOnly: true,
            secure: true,
        }
        return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged Out"))
    } catch (error) {
        throw new ApiError(401, "something went wrong")
    }
})
const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(401, "unothorised request");
        }
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.ACCESS_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "invalid refresh token");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refreshToken is expired")
        }
        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefeshToken(user._id)

        return res.status(200).cookie("accessToken", accessToken).cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                )
                , "Access token refreshed"

            );
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})
const changeCurrentPassword = asyncHandler(async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user?._id);

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid Password");
        }
        user.password = newPassword;
        await user.save({ validateBeforeSave: true })

        return res.status(200).json(
            new ApiResponse(200, {}, "password chamge succesfully")
        )

    } catch (error) {
        throw new ApiError(500, "failed to update password")
    }
});
const getCurrentUser = asyncHandler(async (req, res) => {
    try {
        return res.status(200).json(200, req.user, "Current user fetch successfully")
    } catch (error) {
        throw new ApiError(500, "failed to get User Details")
    }
})
const updateAccountDetails = asyncHandler(async (req, res) => {
    try {
        const { fullName, email, } = req.body;
        if (!fullName && !email) {
            throw new ApiError(400, "All fields are required")
        }
        const user = await User.findByIdAndUpdate(req.user?._id,
            {
                $set: {
                    fullName,
                    email
                }
            },
            { new: true }
        ).select("-password -refreshToken");
        return res.status(200).json(
            new ApiResponse(200, "Account details update SUccessfully")
        );
    } catch (error) {
        throw new ApiError(500, "failed to update user details")
    }
})
const updateUserAvatar = asyncHandler (async (req,res) => {
    try {
        const avatarLocalPath = req.file?.path;
    
        if(!avatarLocalPath){
            throw new ApiError(400," Avatar file is missing");
        }
    
        const avatar = await uploadOnCloudinary(avatarLocalPath)
    
        if(!avatar?.url){
            throw new ApiError(400,"Error While uploading on avatar")
        }
    
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar:avatar.url
                }
            }
        ).select("-password");
        
        if(!user){
            throw new ApiError(400,"failed to update avatar");
        }
        return res.status(200).json(200,"Avatar updated successfully");
    } catch (error) {
        throw new ApiError(500,"something went wrong")
    }

})

const updateUserCoverImage = asyncHandler (async (req,res) => {
    try {
        const coverImageLocalPath = req.file?.path;
    
        if(!coverImageLocalPath){
            throw new ApiError(400,"Cover image file is missing");
        }
    
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
        if(!coverImage?.url){
            throw new ApiError(400,"Error While uploading on Cover image")
        }
    
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    coverImage:coverImage.url
                }
            }
        ).select("-password");
        
        if(!user){
            throw new ApiError(400,"failed to update Cover image");
        }
        return res.status(200).json(200,"Cover image updated successfully");
    } catch (error) {
        throw new ApiError(500,"something went wrong")
    }

})
export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar,updateUserCoverImage };