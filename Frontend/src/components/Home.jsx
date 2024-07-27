import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-dark-bg text-text-light">
            <h1 className="text-4xl font-bold mb-8">Welcome to the Chat Application</h1>
            <div className="space-x-4">
                <Link to="/login" className="bg-purple text-text-light px-4 py-2 rounded shadow hover:bg-dark-purple">
                    Login
                </Link>
                <Link to="/register" className="bg-purple text-text-light px-4 py-2 rounded shadow hover:bg-dark-purple">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Home;
