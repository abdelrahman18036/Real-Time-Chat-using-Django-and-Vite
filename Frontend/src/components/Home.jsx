import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import Chatimage from "../assets/images/chatti-sample.png";
const Home = () => {
    return (
        // <div className="flex flex-col items-center justify-center h-screen bg-dark-bg text-text-light">
        //     <h1 className="text-4xl font-bold mb-8">Welcome to the Chat Application</h1>
        //     <div className="space-x-4">
        //         <Link to="/login" className="bg-purple text-text-light px-4 py-2 rounded shadow hover:bg-dark-purple">
        //             Login
        //         </Link>
        //         <Link to="/register" className="bg-purple text-text-light px-4 py-2 rounded shadow hover:bg-dark-purple">
        //             Register
        //         </Link>
        //     </div>
        // </div>

        <div className="mx-auto mt-20 mb-10 flex h-full w-[90%] flex-col items-center justify-center rounded-[3rem] bg-white px-6 pt-16 pb-7 md:px-16 md:pt-24  md:pb-16 lg:w-[80%] lg:px-20 2xl:px-0">
            <h1 className="mb-2 text-center text-5xl font-medium text-black md:text-6xl lg:text-7xl xl:text-8xl">
                H-Chat
            </h1>
            <div className="mx-auto w-full sm:w-[80%] md:w-full 2xl:w-[70%]">
                <p className="mb-5 text-center text-base font-medium text-black md:text-xl lg:text-xl xl:text-2xl">
                    Getting in touch is more essential than ever. Chat with strangers
                    and people from all over the world. Choose to hide your name and
                    photo and chat with anonymity!
                </p>
            </div>

            {/* <button
                disabled={user ? true : false}
                type="button"
                className="mb-12 flex items-center gap-1 text-lg  text-system-blue md:text-xl lg:text-2xl"
            onClick={() => {
                toast.promise(signIn(), {
                    loading: "Sign in...",
                    success: <b>Signed in successfully!</b>,
                    error: <b>Could not sign in.</b>,
                });
            }}
            >
                <span className="hover-effect"> Sign in with Google</span>
                <MdOutlineArrowForwardIos className="text-base lg:text-xl" />
            </button> */}
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
    );
};

export default Home;
