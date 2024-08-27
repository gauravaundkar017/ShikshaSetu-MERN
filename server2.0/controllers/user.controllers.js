import { json } from "express";
import User  from "../models/user.models.js"
import AppError from "../utils/errorUtil.js";
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import cloudinary from 'cloudinary';
import crypto from 'crypto';
import sendEmail  from '../utils/sendEmail.js'

const cookieOptions ={
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
    // secure : true
}

const testPage = (req,res)=>{
    res.send("PING PONG")
};

const register = async (req, res, next)=>{

    try {
        
        // Destructuring the necessary data from req object
        const {fullName, email, password} = req.body;
        if(!fullName || !email || !password){
            return next(new AppError('All fields are required', 400));
        }
        const userExists = await User.findOne({email});
        if (userExists) {
            return next(new AppError('Email is already exists'))
        }
        const user = await User.create({
            fullName,
            email,
            password,
            avatar : {
                public_id : email,
                secure_url : 'https://res.cloudinary.com/du9qlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
            }
        });

        if(!user){
            return next(new AppError('User registration Failed, please try again',400))
        }

        //File upload
        
        if(req.file){
            // console.log("FIle Details => ", req.file );
            
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder : 'LMS',
                    width : 250,
                    height : 250,
                    gravity : 'face',
                    crop  : 'fill'
                });

                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    fs.rm(`uploads/${req.file.filename}`);
                }

                // res.status(200).json({
                //     success : true,
                //     messeg : "File uploaded successfully."
                // })


                
            } catch (error) {
                return next(new AppError(error.message || 'file not uploaded, please try again.', 500));
                
            }

        }


        await user.save();

        const token = await user.jwtToken();
        user.password = undefined;

        res.cookie('token', token, cookieOptions);
        res.status(201).json({
            success : true,
            message : 'User registered successfully',
            user
        })
        } catch (e) {
            return next(new AppError(e.message, 500));
            
        }    
}


const login = async(req, res, next)=>{
    try {
        
        const {email, password} = req.body;
        if (!email || !password) {
            return next(new AppError('All fields are required', 400))            
        }
        const user = await User.findOne({email})
        .select('+password');

        if(!user || !(await bcrypt.compare(password, user.password))){
            return next(new AppError("Invalid credential", 400));
                
        }

        // if (!user || !comparePassword(password)) {
        //     return next(new AppError('Email or password does not exixsts', 400));
        // }
        

        const token = await user.jwtToken();
        user.password = undefined;
        
        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success : true,
            message : "User loggedin successfully.",
            user
        });
        
        
        
    } catch (error) {
        return next(new AppError(error.message, 500))
        
    }
    
}

const logout = (req, res, next)=>{
    try {
        // res.cookie(null);
        res.cookie('token', null, {httpOnly : true, maxAge : 0, secure : true});
        res.status(200).json({
            success : true,
            message : "User logged out successfully"
        })
        
    } catch (error) {
        return next(new AppError(error.message, 500))   
    }
}


const getProfile = async (req, res, next)=>{

    try {
        // const user = await User.find({});
        const userId = req.user.id;
        const user = await User.findById(userId);
        res.status(200).json({
            success : true,
            message : "User Details",
            user
        })
        
    } catch (e) {
        return next(new AppError(e.message, 500))
        
    }    
}




const forgotPassword = async (req, res, next) => {
    
    const { email } = req.body;
  
    if (!email) {
      return next(new AppError('Email is required', 400));
    }
  
    const user = await User.findOne({ email });
  
    // If no email found send the message email not found
    if (!user) {
      return next(new AppError('Email not registered', 400));
    }
  
    // Generating the reset token via the method we have in user model
    const resetToken = await user.generatePasswordResetToken();
  
    await user.save();
  
    // constructing a url to send the correct data
    /**HERE
     * req.protocol will send if http or https
     * req.get('host') will get the hostname
     * the rest is the route that we will create to verify if token is correct or not
     */
    
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
    // We here need to send an email to the user with the token
    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;
  
    try {
      await sendEmail(email, subject, message);
  
      // If email sent successfully send the success response
      res.status(200).json({
        success: true,
        message: `Reset password token has been sent to ${email} successfully`,
      });
    } catch (error) {
      // If some error happened we need to clear the forgotPassword* fields in our DB
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
  
      await user.save();
  
      return next(
        new AppError(
          error.message || 'Something went wrong, please try again.',
          500
        )
      );
    }
  };
  
 const resetPassword = async (req, res, next) => {
    // Extracting resetToken from req.params object
    const { resetToken } = req.params;
  
    // Extracting password from req.body object
    const { password } = req.body;
  
    // We are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm
    const forgotPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    // Check if password is not there then send response saying password is required
    if (!password) {
      return next(new AppError('Password is required', 400));
    }
  
    console.log(forgotPasswordToken);
  
    // Checking if token matches in DB and if it is still valid(Not expired)
    const user = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() }, // $gt will help us check for greater than value, with this we can check if token is valid or expired
    });
  
    // If not found or expired send the response
    if (!user) {
      return next(
        new AppError('Token is invalid or expired, please try again', 400)
      );
    }
  
    // Update the password if token is valid and not expired
    user.password = password;
  
    // making forgotPassword* valus undefined in the DB
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
  
    // Saving the updated user values
    await user.save();
  
    // Sending the response when everything goes good
    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  };

const changePassword = async (req, res, next) =>{
    
    try {
       
        const {oldPassword, newPassword} = req.body;
        const {id} = req.user;
        
        if(!oldPassword || !newPassword){
            return next(new AppError('All fields are required.', 400))
        }

        const user = await User.findById(id).select('+password');

   

        if (!user) {
            return next(new AppError('User does not exists', 400));
        }

        
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password)

        if (!isPasswordValid) {
            return next(new AppError('Password does not match', 400));   
        }

        user.password = newPassword;

        await user.save();

        user.password = undefined;

        res.status(200).json({
            success : true,
            message : "Password changed successfully",
        })
        
        
    } catch (error) {
        return next(new AppError(error.message , 500));
    }

}

const updateProfile = async (req, res, next) =>{
    try {
        const {fullName} = req.body;
        // console.log(fullName);
        const {id} = req.user;
        // console.log(id);

        const user = await User.findByIdAndUpdate(id);
        // console.log(user);

        if (!user) {
            return next(new AppError("User does not exists", 500));
        }

        if(req.body){
            console.log(fullName);
            user.fullName = fullName;
            
        }
        // console.log(fullName);
        // console.log(user);

        if(req.file){
            
            try {
               
                await cloudinary.v2.uploader.destroy(user.avatar.public_id);
                
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder : 'LMS',
                    width : 250,
                    height : 250,
                    gravity : 'face',
                    crop  : 'fill'
                });

                console.log(result);


                if (result) {

                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    fs.rm(`uploads/${req.file.filename}`);
                }
                
            } catch (error) {
                return next(new AppError(error.message || 'file not uploaded, please try again.', 500));
                
            }
        }
            
        await user.save();
        res.status(200).json({
            success : true,
            messgae : "Profile updated successfully",
            user
        })
        
    } catch (error) {
        return next(new AppError(error.message, 500))
        
    }

}


const contactUs = async (req, res, next) => {
    // Destructuring the required data from req.body
    const { name, email, message } = req.body;
  
    // Checking if values are valid
    if (!name || !email || !message) {
      return next(new AppError('Name, Email, Message are required'));
    }
  
    try {
      const subject = 'Contact Us Form';
      const textMessage = ` ${name} - ${email} <br /> ${message}`;
    // const textMessage = `
    //   <p><strong>Name:</strong> ${name}</p>
    //   <p><strong>Email:</strong> ${email}</p>
    //   <p><strong>Message:</strong></p>
    //   <p>${message}</p>
    // `;
    console.log(textMessage);
    
      // Await the send email
      const e = await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);
      console.log(e);
      
    } catch (error) {
      console.log(error);
      return next(new AppError(error.message, 400));
    }
  
    res.status(200).json({
      success: true,
      message: `Your request has been submitted successfully to email : ${process.env.CONTACT_US_EMAIL}`,
    });
  };

  

export{
    testPage,
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
    contactUs
}