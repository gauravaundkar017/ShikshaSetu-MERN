import { useNavigate } from "react-router-dom";

function Denied() {
    const navigate = useNavigate();
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
        <h1 className="text-9xl font-extrabold text-white tracking-widest">403</h1>
        <div className="bg-black text-white px-2 text-sm rounded rotate-12 absolute">Access denied...</div>
        <button className="mt-5 ">
          <a className="relative inline-block text-sm font-medium text-[#fff]">
            <span onClick={()=>navigate(-1)} className="relative block px-8 py-3 bg-[#1A2238] border border-[#FfF] rounded-lg hover:bg-white hover:text-blue-950 font-extrabold transition-all ease-in-out duration-300 tracking-widest">

              Go Back
            </span>
          </a>
        </button>
      </div>
    );

}

export default Denied;