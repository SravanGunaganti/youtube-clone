import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineSearch, AiOutlineBell } from "react-icons/ai";
import { HiOutlineBars3 } from "react-icons/hi2";
import { MdKeyboardVoice } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { BsArrowLeft, BsCameraVideo } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { IoMdArrowRoundBack } from "react-icons/io";
import Overlay from "./Overlay";

const Navbar = ({ onMenuToggle }) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="fixed w-screen top-0 z-50 flex justify-between items-center px-4 h-14 bg-white gap-2">
      <div className="flex items-center">
        <button
          onClick={() => {
            onMenuToggle();
          }}
          className="p-2 flex items-center border-none justify-center rounded-full hover:bg-gray-200 dark:hover:bg-[#1f1f1f]">
          <HiOutlineBars3 size={24} />
        </button>
        <div className="flex-none relative">
          <img
            src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
            className="w-[93px] mx-[16px] my-[18px]"
          />
          <span className="text-[10px] absolute top-3 text-gray-500 right-1">
            IN
          </span>
        </div>
      </div>

      <div className="hidden md:flex rounded-3xl justify-between items-center w-fit  flex-1 max-w-xl ">
        <div className="h-full flex justify-between items-center border overflow-hidden border-gray-300 rounded-3xl flex-grow pl-2">
          <input
            type="search"
            placeholder="Search"
            className="outline-0 rounded-l-3xl w-full px-4"
          />
          <div className="bg-gray-100 hover:bg-gray-200 h-full flex p-2 justify-center items-center rounded-r-3xl">
            <button className="h-full w-[40px] flex justify-center items-center">
              {" "}
              <CiSearch fontSize={24} />
            </button>
          </div>
        </div>

        <div className="rounded-full bg-gray-100 hover:bg-gray-200 ml-4 p-2">
          <MdKeyboardVoice fontSize={24} />
        </div>
      </div>
      <div className="md:hidden hover:bg-gray-200 h-full flex p-2 justify-center items-center rounded-full">
        <button
          onClick={() => setShowSearch(true)}
          className="h-full flex justify-center items-center">
          {" "}
          <CiSearch fontSize={20} />
        </button>
      </div>

      {showSearch && (
        <div className="h-14 md:hidden fixed z-60 top-0 left-0 right-0 px-2 bg-white w-full flex justify-between gap-2 items-center">
          <button
            onClick={() => setShowSearch(false)}
            className="h-full flex justify-center items-center">
            {" "}
            <IoMdArrowRoundBack fontSize={24} />
          </button>
          <div className="flex rounded-3xl justify-between items-center w-fit  flex-1 max-w-xl ">
            <div className="h-full flex justify-between items-center border overflow-hidden border-gray-300 rounded-3xl flex-grow pl-2">
              {/* <div className='bg-gray-100 h-full flex p-2 justify-center items-center'>
                      <button className='h-full w-[40px] flex justify-center items-center'> <AiOutlineSearch fontSize={24}/></button>

                    </div> */}

              <input
                type="search"
                placeholder="Search"
                className="outline-0 rounded-l-3xl w-full px-4"
              />
              <div className="bg-gray-100 hover:bg-gray-200 h-full flex p-2 justify-center items-center rounded-r-3xl">
                <button className="h-full w-[40px] flex justify-center items-center">
                  {" "}
                  <CiSearch fontSize={24} />
                </button>
              </div>
            </div>

            <div className="rounded-full bg-gray-100 hover:bg-gray-200 ml-4 p-2">
              <MdKeyboardVoice fontSize={24} />
            </div>
          </div>
        </div>
      )}
      {showSearch && <Overlay />}

      <div className="right">
        {/* <div className='icons'>
                <AiOutlineSearch/>
            </div>
            <div className='icons desktop'>
                <BsCameraVideo/>
            </div>
            <div className='icons desktop'>
                <AiOutlineBell/>
            </div>
            <div className='profileImag'>
                {/* <img src=''/> */}
        {/*</div> */}

        <button className="flex items-center px-2 gap-2 py-1 text-blue-700 bg-none border-2 font-semibold text-sm border-gray-200 rounded-3xl">
          <CgProfile fontSize={24} /> Sign in
        </button>
      </div>
    </header>
  );
};

export default Navbar;
