import React from 'react';
import { useTheme } from "../contexts/ThemeContext";
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className={`p-4 shadow-lg flex justify-between items-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h1 className="text-2xl font-bold">Chat Application</h1>
            <button onClick={toggleTheme} className="text-current">
                {theme === 'dark' ? <FaSun size={24} /> : <FaMoon size={24} />}
            </button>
        </header>
    );
};

export default Header;
