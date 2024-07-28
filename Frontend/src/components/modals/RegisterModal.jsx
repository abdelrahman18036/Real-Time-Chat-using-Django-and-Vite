import React, { useState } from "react";
import { useWebSocket } from "../../contexts/WebSocketContext";
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const RegisterModal = ({ isOpen, onClose, onRegisterSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useWebSocket();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(username, password);
            toast.success("Registration successful! Please log in.");
            onRegisterSuccess();
        } catch (error) {
            toast.error("Registration failed. Please try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                className="bg-white dark:bg-dark-bg p-6 rounded-lg shadow-lg w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-black dark:text-text-light">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-dark-bg text-black dark:text-text-light shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-black dark:text-text-light">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:bg-dark-bg text-black dark:text-text-light shadow-sm"
                        />
                    </div>
                    <div className="flex justify-between space-x-2">
                        <button type="submit" className="bg-purple text-white px-4 py-2 rounded shadow hover:bg-dark-purple transition duration-300 ease-in-out">
                            Register
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition duration-300 ease-in-out"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterModal;
