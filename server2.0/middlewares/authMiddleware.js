import AppError from "../utils/errorUtil.js";
import jwt from 'jsonwebtoken';

const isLoggedIn =  (req, res, next) =>{
    
    const {token} = req.cookies;
    // console.log(token);
    if (!token) {
        return next(new AppError('Unauthenticated, please login again.',400))
    }
    const userDetalis = jwt.verify(token, process.env.JWT_SECRET)

    if (!userDetalis) {
        return next(new AppError("Unauthorized, please login to continue", 401));
      }

    req.user = userDetalis;

    // console.log(userDetalis);
    next();
}

const authorizedRoles = (...roles) => async (req, res, next)=>{
    const currentUserRole = req.user.role;
    if(!roles.includes(currentUserRole)){
        return next(new AppError("You do not have permission to access this route", 400))
    }
    next();
}
export{
    isLoggedIn,
    authorizedRoles 
}