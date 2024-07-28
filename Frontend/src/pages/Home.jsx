import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import Chatimage from "../assets/images/chatti-sample.png";
import { useTheme } from "../contexts/ThemeContext";

const Home = () => {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4">

            <div className="mx-auto mt-20 mb-10 flex h-full w-[90%] flex-col items-center justify-center rounded-[3rem] bg-white dark:bg-gray-800 px-6 pt-16 pb-7 md:px-16 md:pt-24 md:pb-16 lg:w-[80%] lg:px-20 2xl:px-0">
                <h1 className="mb-2 text-center text-5xl font-medium text-black dark:text-white md:text-6xl lg:text-7xl xl:text-8xl">
                    H-Chat
                </h1>
                <div className="mx-auto w-full sm:w-[80%] md:w-full 2xl:w-[70%]">
                    <p className="mb-5 text-center text-base font-medium text-black dark:text-gray-300 md:text-xl lg:text-xl xl:text-2xl">
                        Getting in touch is more essential than ever. Chat with strangers
                        and people from all over the world. Choose to hide your name and
                        photo and chat with anonymity!
                    </p>
                </div>
                <div>
                    <img
                        src={Chatimage}
                        width={1016}
                        height={720}
                        priority
                        alt="Chatti Thumbnail"
                        className="rounded-md md:rounded-lg lg:rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
