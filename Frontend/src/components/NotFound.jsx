import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-dark-bg text-text-light">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-lg mb-4">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="bg-purple text-text-light px-4 py-2 rounded shadow hover:bg-dark-purple">
                Go to Home
            </Link>
        </div>
    );
};

export default NotFound;
