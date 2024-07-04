import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Cloudinary storage instance
export const postStorage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png", "jpeg"],
    params: {
        folder: "Bondify-App/post",
        format: "jpg",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
});

export const userStorage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png", "jpeg"],
    params: {
        folder: "Bondify-App/user",
        format: "jpg",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
});