import {model, Schema} from 'mongoose';

const courseSchema = new Schema({
    title : {
        type : String,
        required : [true, 'Title is required'],
        minLength : [5, 'Title must be atleast 5 charcters'],
        maxLngth : [60, 'Title should be less than 60 characters'],
        trim : true
    },
    description : {
        type : String,
        required : [true, 'Title is required'],
        minLength : [5, 'Title must be atleast 5 charcters'],
        maxLngth : [160, 'Title should be less than 160 characters'],
        trim : true
    },
    category : {
        type : String,
        required : true
    },

    thumbnail : {
        public_id : {
            type : String,
        },
        secure_url : {
            type : String,
        }
    },
    lectures : [
        {
            title : String,
            description : String ,
            lecture : {
                public_id : {
                    type : String,
        
                    
                },
                secure_url : {
                    type : String,
        
                }
            }
        }
    ],

    

    numberOfLectures : {
        type : Number,
        default : 0
    },
    
    createdBy : {
        type : String,
        requied : [true, 'Created by is required']

    },
},{
    timestamps : true
});

const Course = model('Course',courseSchema);
export default Course;