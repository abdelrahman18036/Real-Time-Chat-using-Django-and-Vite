import React, { useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Chatimage from "../assets/images/chatti-sample.png";
import LoginModal from "../components/modals/LoginModal";
import RegisterModal from "../components/modals/RegisterModal";

const Home = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const handleSignInClick = () => {
        setIsLoginModalOpen(true);
    };

    const handleRegisterClick = () => {
        setIsRegisterModalOpen(true);
    };

    return (
        <div className="mx-auto mt-20 mb-10 flex h-full w-[90%] flex-col items-center justify-center rounded-[3rem] bg-white dark:bg-gray-800 px-6 pt-16 pb-7 md:px-16 md:pt-24  md:pb-16 lg:w-[80%] lg:px-20 2xl:px-0 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
            <motion.h1
                className="mb-2 text-center text-3xl md:text-4xl lg:text-5xl font-medium text-black dark:text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                H-Chat
            </motion.h1>
            <motion.div
                className="mx-auto w-full sm:w-[80%] md:w-full 2xl:w-[70%]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <p className="mb-5 text-center text-sm md:text-base lg:text-lg font-medium text-black dark:text-white">
                    Getting in touch is more essential than ever. Chat with strangers
                    and people from all over the world. Choose to hide your name and
                    photo and chat with anonymity!
                </p>
                <div className="flex justify-center space-x-4">
                    <button
                        type="button"
                        className="flex items-center gap-1 text-sm md:text-lg text-system-blue hover:text-blue-700 transition duration-300 ease-in-out"
                        onClick={handleSignInClick}
                    >
                        <span className="hover-effect">Login</span>
                        <MdOutlineArrowForwardIos className="text-base lg:text-xl" />
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-1 text-sm md:text-lg text-system-blue hover:text-blue-700 transition duration-300 ease-in-out"
                        onClick={handleRegisterClick}
                    >
                        <span className="hover-effect">Register</span>
                        <MdOutlineArrowForwardIos className="text-base lg:text-xl" />
                    </button>
                </div>
            </motion.div>
            <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <img
                    src={Chatimage}
                    width={1016}
                    height={720}
                    priority
                    alt="Chatti Thumbnail"
                    className="rounded-md md:rounded-lg lg:rounded-xl shadow-lg"
                />
            </motion.div>
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onRegisterSuccess={() => {
                setIsRegisterModalOpen(false);
                setIsLoginModalOpen(true);
                toast.success("Registration successful! Please log in.");
            }} />
        </div>
    );
};

export default Home;
