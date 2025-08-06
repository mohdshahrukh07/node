//by promisses

// const asyncHandler = (requestHandler) => {
//     (req,res,next) => {
//         Promise.resolve((req,res,next))
    //    .catch((err) => next(err));
//     }
// }

// by try cahtch error handling
const asyncHandler = (fn) => async (req,res,next) => {
    try {
        return await fn(req,res,next);
    } catch(error){
       return await res.status(error.code || 500).json({
            success:false,
            message:error.message || "Internal Server Error",
        });
    }
}

export default asyncHandler;