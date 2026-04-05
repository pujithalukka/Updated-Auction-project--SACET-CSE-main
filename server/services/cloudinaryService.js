import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const uploadImage = async (file) => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }
        
        // Since we're using CloudinaryStorage with multer,
        // the file is already uploaded and we just need to return the path
        if (!file.path) {
            throw new Error('No file path available');
        }

        console.log('File successfully uploaded to Cloudinary:', file.path);
        return file.path;
        
    } catch (error) {
        console.error('Upload error:', {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
};

export default uploadImage;
