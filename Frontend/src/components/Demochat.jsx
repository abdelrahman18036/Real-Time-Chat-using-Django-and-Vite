import React, { useEffect, useRef, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { RiSendPlaneFill } from "react-icons/ri";
import { BsEmojiWink, BsImageFill } from "react-icons/bs";
import { BsPencilSquare, BsSearch } from "react-icons/bs";

import { useTheme } from "../contexts/ThemeContext";
import Darkimg from '../assets/images/dark-background.jpg';
import Lightimg from '../assets/images/light-background.jpg';

export default function Demochat() {
    const { theme } = useTheme();

    const backgroundImage = theme === 'dark' ? Darkimg : Lightimg;

    return (
        <div
            className='grid h-full place-items-center h-screen'
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className='relative m-auto flex max-h-[1080px] w-screen max-w-screen-xl md:h-[90vh] md:w-[90vw] lg:h-[85vh] lg:w-[95vw] xl:w-[70vw] 2xl:w-[95vw]'>

                <div className="absolute left-0 top-0 flex h-full w-full flex-col justify-between rounded-tl-lg rounded-bl-lg bg-white/70 backdrop-blur-xl md:static md:w-[70%] lg:w-[60%]">
                    <div className="flex items-center justify-between p-4">
                        <ul className="flex space-x-2 [&>li]:h-3 [&>li]:w-3 [&>li]:cursor-pointer [&>li]:rounded-full [&>li]:border [&>li]:border-black/10">
                            <li className="bg-red-400"></li>
                            <li className="bg-yellow-400"></li>
                            <li className="bg-green-400"></li>
                        </ul>
                        <BsPencilSquare className="pointer-cursor cursor-pointer text-xl text-system-gray-dark-2" />

                    </div>

                    <div className="relative flex h-full flex-col space-y-5 overflow-y-auto px-4 pb-5">

                        <form className="relative mt-5 flex">
                            <BsSearch className="absolute left-3 top-1/3 text-[#827478]" />
                            <input
                                maxLength={70}
                                type="search"
                                placeholder="Search"
                                className="w-full rounded-md bg-white/50 py-2 pl-8 pr-5 outline-none placeholder:text-[#827478]"
                            />
                        </form>



                        <div>
                            <p className="rounded-t-lg bg-white/75 py-2 px-4 font-medium capitalize">
                                orangge
                            </p>

                        </div>


                    </div>
                </div>
                <div className="z-[11] flex h-screen w-full flex-col overflow-hidden rounded-tr-lg rounded-br-lg border-l-[1.5px] border-gray-300 bg-white md:h-full">
                    <div className="z-10 flex w-full justify-between rounded-tr-lg border-b-[1.5px] border-gray-300 bg-system-gray-5 px-5 pt-7 pb-3 md:px-8">
                        <div>
                            <span className="text-system-gray-1">To: </span>{" "}
                            <span className="font-medium">Public</span>
                        </div>
                        <button type="button" className="cursor-pointer text-system-blue">
                            Profile
                        </button>
                    </div>
                    <div className="scroll-container h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth py-3">
                        <p className="my-10 text-center text-system-gray-1">
                            Maximum of 25 messages are shown.
                        </p>
                        <span></span>
                    </div>
                    {/* Message Input */}
                    <div className="flex w-full items-center justify-between space-x-3 rounded-br-lg border-t-[1.5px] border-gray-300 bg-system-gray-6 p-5">
                        <div className="icons flex items-center space-x-3 text-system-gray-dark-1">
                            <AiFillPlusCircle className="cursor-pointer text-[1.7rem]" />
                        </div>
                        <form onSubmit={(e) => createMessage(e)} className="relative flex w-full">
                            <input
                                type="text"
                                maxLength={355}
                                placeholder="Aa"
                                className="w-full rounded-full border-2 border-system-gray-3 py-1 pl-5 pr-11 text-xl outline-none"
                            />
                            <button className="absolute top-1/4 right-5 cursor-pointer text-xl text-system-blue">
                                <RiSendPlaneFill />
                            </button>
                        </form>
                        <BsEmojiWink className="cursor-pointer text-4xl text-system-gray-dark-2 md:text-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
