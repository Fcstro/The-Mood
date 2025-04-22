import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Define the path to the uploads directory
const uploadsDir = path.join(process.cwd(), '../appsdev-spa-template/src/uploads');

// Check if the uploads directory exists, and create it if it doesn't
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created:', uploadsDir);
} else {
    console.log('Uploads directory exists:', uploadsDir);
}

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Use the uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(8).toString('hex'); // Generate a unique suffix
        const ext = path.extname(file.originalname); // Get the file extension
        cb(null, `${req.user.id}-${uniqueSuffix}${ext}`); // Rename the file
    }
});

// Create the multer instance
const upload = multer({ storage });

export default upload;