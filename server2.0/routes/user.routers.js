import  Router  from "express";
import { register, contactUs, login, logout, getProfile, testPage, changePassword, updateProfile, forgotPassword,resetPassword } from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";
import User from "../models/user.models.js";

const router = Router();

router.get('/testpage', testPage);
router.post('/register',upload.single('avatar') ,register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me',isLoggedIn, getProfile);
router.post("/reset", forgotPassword);
router.post("/reset/:resetToken", resetPassword);
router.post('/change-password',isLoggedIn, changePassword);
router.put('/update/:id', isLoggedIn, upload.single('avatar'), updateProfile);


//
router.route('/contact').post(contactUs);

// Route to update subscription status
router.post('/subscription', isLoggedIn, async (req, res) => {
    const { status } = req.body;
  
    try {
      if (!status) {
        return res.status(400).json({ message: 'Subscription status is required' });
      }
  
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.subscription.status = status;
      await user.save();
  
      res.status(200).json({ message: 'Subscription status updated successfully',user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

export default router;
