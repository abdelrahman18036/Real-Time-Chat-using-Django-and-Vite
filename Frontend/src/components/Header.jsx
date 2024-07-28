import React from 'react';
import { useTheme } from "../contexts/ThemeContext";
import { useWebSocket } from "../contexts/WebSocketContext";
import { FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { username, logout } = useWebSocket();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully!");
        navigate("/");
    };

    return (
        <header className={`fixed top-0 left-0 w-full p-4 flex justify-between items-center bg-transparent z-50 ${theme === 'dark' ? 'text-white' : 'text-black'} transition-colors duration-500`}>
            <Link to="/"> <h1 className="text-2xl font-bold">XOV</h1></Link>
            <div className="flex items-center space-x-4">
                <button onClick={toggleTheme} className="text-current">
                    {theme === 'dark' ? <FaSun size={24} /> : <FaMoon size={24} />}
                </button>
                {username && (
                    <button onClick={handleLogout} className="text-current">
                        <FaSignOutAlt size={24} />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
