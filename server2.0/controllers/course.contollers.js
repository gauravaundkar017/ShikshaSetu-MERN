import { log } from "console";
import Course from "../models/course.models.js";
import AppError from "../utils/errorUtil.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'

const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({}).select('-lectures');
        if(!courses){
            return next(new AppError("Empty List", 404));
        }
        res.status(200).json({
            success : true,
            message : "All Courses",
            courses
        })
        
    } catch (error) {
        return next (new AppError(error.message, 500))   
    }
    
};


const getLecturesByCourseId = async (req, res, next) => {
    console.log("Request params:", req.params);
    const { id } = req.params;
  
    console.log("id",id);
    const course = await Course.findById(id);
  
    if (!course) {
      return next(new AppError('Invalid course id or course not found.', 404));
    }
  
    res.status(200).json({
      success: true,
      message: 'Course lectures fetched successfully',
      lectures: course.lectures,
    });
  }
// const getLecturesByCourseId  = async (req, res, next) => {
//     try {
//         const {id} = req.param;
        
//         const course = await Course.findById(id)
//         if(!course){
//             return next(new AppError('Invalid course id or course not found.', 404))
//         }
//         res.status(200).json({
//             success : true,
//             message : "Course lecture fetched successfully.",
//             lectures : course.lectures
//         });
        
//     } catch (error) {
//         return next (new AppError(error.message, 500))   
//     }

// };


const createCourse  = async (req, res, next) =>{
    try {
        const {title, description, category, createdBy} = req.body;

        if(!title || !description || !category || !createdBy){
            return next(new AppError("All fields are required", 400));
        }

        const course = await Course.create({
            title,
            description,
            category,
            createdBy
        });

        if(!course){
            return next(new AppError('Course could not created, please try again', 500));
        }

        try {
            if(req.file){
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder : "LMS"
                });
                if(result){
                    course.thumbnail.public_id = result.public_id;
                    course.thumbnail.secure_url = result.secure_url;
                }
    
                fs.rm(`uploads/${req.file.filename}`);
            }    
            
        } catch (error) {
            return next (new AppError(error.message, 500))
        }

        
        await course.save();
        
        res.status(200).json({
            success : true,
            message : "Course created successfully.",
            course
        })
        
    } catch (error) {
        return next (new AppError(error.message, 500))   
    }
    
}



const updateCourse  = async (req, res, next) =>{
    try {

        const {id} = req.params


        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set : req.body
            },
            {
                runValidators : true
            }
        )
        if(!course){
            return next(new AppError("Course with given id does not exists", 500));
        }

        try {
            await cloudinary.v2.uploader.destroy(course.thumbnail.public_id)
            if(req.file){
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder : "LMS"
                });
                if(result){
                    course.thumbnail.public_id = result.public_id;
                    course.thumbnail.secure_url = result.secure_url;
                }
    
                fs.rm(`uploads/${req.file.filename}`);
            }    
            
        } catch (error) {
            return next (new AppError(error.message, 500))
        }



        await course.save();
        
        res.status(200).json({
            success : true,
            message : "Course Updted successfully ",
            course

        })

        
    }  catch (error) {
        return next (new AppError(error.message, 500))   
    }
    
}



const removeCourse = async (req, res, next)=>{
    try {
        const {id} = req.params;
        const course = await Course.findByIdAndDelete(id);
        // const course = await Course.findById(id);
        if (!course) {
            return next(new AppError("Course with given id does not exists", 400));
        }

        // await course.deleteOne();
        
        res.status(200).json({
            success : true,
            message : "Course Deleted successfully ",
            course

        })

        
    } catch (error) {
        return next(new AppError(error.message, 500))      
    }
}

const addLectureToCourseById  = async (req, res, next) =>{
    
    try {
        const {title, description} = req.body;
        const {id} = req.params;

        if (!title || !description) {
            return next( new AppError("All fields are required",400));        
        }



        const course = await Course.findById(id);
        // console.log(course);
        if (!course) {
            return next(new AppError("Course with given id does not exists", 500));
        }

        const lectureData = {
            title,
            description,
            lecture : {}
        }

        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    resource_type: 'video',
                    folder : 'lms'
                });
        
                if(result){
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                }
        
                fs.rm(`uploads/${req.file.filename}`);
                
                
            } catch (error) {
                return next(new AppError(error.message, 500))  
                
            } 
        }

        // console.log(lectureData);

        course.lectures.push(lectureData);
        course.numberOfLectures = course.lectures.length;
    
        await course.save();
    
        res.status(200).json({
            success : true,
            message : "Lecture successfully added to course",
            course
        })
    

        
    }  catch (error) {
        return next (new AppError(error.message, 500))   
    }
    
}


const deleteLectureFromCourseById = async (req, res, next)=>{
    try {
        
        const { courseId, lectureId } = req.query;

        if(!courseId){
            return next(new AppError('Course ID is required.', 400));
        }
        
        if(!lectureId){
            return next(new AppError('Lecture ID is required.', 400));
        }

        const course = await Course.findById(courseId);

        // If no course send custom message
        if (!course) {
          return next(new AppError('Invalid ID or Course does not exist.', 404));
        }
      
        // Find the index of the lecture using the lectureId
        const lectureIndex = course.lectures.findIndex(
          (lecture) => lecture._id.toString() === lectureId.toString()
        );
      
        // If returned index is -1 then send error as mentioned below
        if (lectureIndex === -1) {
          return next(new AppError('Lecture does not exist.', 404));
        }


        const result = await Course.updateOne(
            { "_id": courseId },
            { $pull: { "lectures": { "_id": lectureId } } }
        );

        // console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s)`);

        res.status(200).json({
            success : true,
            message : "lecture deleted successfully",
            result
           
        })


        
    } catch (error) {
        return next(new AppError(error.message, 500))      
    }
}


export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    deleteLectureFromCourseById
    
}
