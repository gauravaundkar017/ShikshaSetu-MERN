import { Link } from "react-router-dom";

import HomePageImage from '../Assets/Images/homepagelogo.png'
import HomeLayout from "../Layouts/HomeLayout";
export default function HomePage() {
   

  return (
    <HomeLayout>
      <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]">
        <div className="w-1/2 space-y-6">
        <div className="font-semibold text-yellow-400 
          text-5xl
          -space-y-3
        ">
          ShiskshaSetu : <span className=" text-white
          text-3xl "> The Bridge of Education</span>
        </div>
          <h1 className="text-5xl font-semibold">
            Find out best {" "}
            <span className="text-yellow-500 font-bold">
              Online Course
            </span>
          </h1>
          <p>
            <span className="text-xl text-gray-200">
              We have a large library of courses taught by highly skilled and qualified faculties at very affordable cost.
            </span>
          </p>
          <div className="space-x-6">
            <Link to={"/courses"}>
                <button className="bg-yellow-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                    Explore Course

                </button>
            </Link>
            <Link to={"/contact"}>
                <button className= "border border-yellow-500  px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all ease-in-out duration-300">
                    Contact Us

                </button>
            </Link>

          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center ">
            <img src={HomePageImage} alt="homepage imgae" />
        </div>
      </div>
    </HomeLayout>
    
  );
}
