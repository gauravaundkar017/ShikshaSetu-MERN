
import { Router } from "express";
import { addLectureToCourseById, createCourse, deleteLectureFromCourseById, getAllCourses, getLecturesByCourseId, removeCourse, updateCourse } from "../controllers/course.contollers.js";
import { authorizedRoles, isLoggedIn } from "../middlewares/authMiddleware.js";
import upload from '../middlewares/multerMiddleware.js'

const router = Router();

// router.get('/', getAllCourses);
router.route('/')
    .get(
        getAllCourses
    )
    .post(
        isLoggedIn, 
        authorizedRoles('ADMIN'), 
        upload.single('thumbnail'), 
        createCourse
    )
    .delete(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        deleteLectureFromCourseById
    )
    
// router.get('/:id',isLoggedIn, getLecturesByCourseId);
router.route('/:id')
    .get(isLoggedIn,getLecturesByCourseId)
    .put(
        isLoggedIn, 
        authorizedRoles('ADMIN'), 
        upload.single('thumbnail'), 
        updateCourse
    )
    .delete(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        removeCourse
    )
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('lecture'),
        addLectureToCourseById
    )
    
    


export default router;