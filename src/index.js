import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: './.env'
});

connectDB().then(()=>{
    app.listen(process.env.PORT,() => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}) .catch (error => {
    console.log("MONGODB Connection Failed !!! ", error);
    process.exit(1); // Exit the process with failure
})

// const app = express();
// const PORT = process.env.PORT || 5000;

// ;( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

//         app.on("error",(error)=>{
//             console.error("Error connecting to the database", error);
//             throw error;
//         });

//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });

//     } catch (error) {
//         console.error("Error", error);
//         throw error;
//     }
// })()