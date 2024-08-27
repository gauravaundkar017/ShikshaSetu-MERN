import { configureStore } from "@reduxjs/toolkit";

import authSliceReducer from "./Slices/AuthSlice";
import courseSliceReducer from "./Slices/CourseSlice"
import LectureSliceReducers from "./Slices/LectureSlice";
import RazorpaySliceReducer from "./Slices/RazorpaySlice";
import statSliceReducer from "./Slices/statSlice";

const store = configureStore({
    reducer : {
        auth : authSliceReducer,
        course : courseSliceReducer,
        razorpay : RazorpaySliceReducer,
        lecture : LectureSliceReducers,
        stat: statSliceReducer,

    },
    devTools : true
})

// const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;