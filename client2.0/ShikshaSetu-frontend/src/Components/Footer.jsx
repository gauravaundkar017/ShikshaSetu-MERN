import {BsFacebook, BsInstagram, BsLinkedin,BsTwitterX } from 'react-icons/bs'

export default function Footer() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
  return (
    <>
        <footer className='relative  -bottom-8 h-[5vh] py-5 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-700 sm:px-20'>
            <section className='text-lg '  >
                &copy; {year} | All rights reserved
            </section>
            <section className='flex items-center justify-center gap-5 text-2xl text-white'>
                <a className='hover:text-blue-400 cursor-pointer transition-all ease-in-out duration-300'>
                    <BsFacebook/> 
                </a>
                <a className='hover:text-pink-500 cursor-pointer transition-all ease-in-out duration-300'>
                    <BsInstagram/>
                </a>
                <a className='hover:text-black cursor-pointer transition-all ease-in-out duration-300'>
                    <BsTwitterX/>
                </a>
                <a className='hover:text-blue-500 cursor-pointer transition-all ease-in-out duration-300'>
                    <BsLinkedin/>
                </a>

            </section>
        </footer>
    </>
  )
}
