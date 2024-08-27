
import app from './app.js';
import connectToDb from './config/dbConnection.js';
import {v2 as cloudinary} from 'cloudinary'; 

const PORT = process.env.PORT || 5000;


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Razorpay configuration
// export const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_SECRET,
//   });
  


app.listen(PORT, async () => {
    await connectToDb();
    console.log(`App is running at http://localhost:${PORT}`);
})