import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWebSocket } from "../contexts/WebSocketContext";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useWebSocket();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        await register(username, password);
        navigate("/login");
    };

    return (
        <form onSubmit={handleRegister} className="m-3 space-y-4 max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-4">Register</h2>
            <div>
                <label className="block text-sm font-medium text-text-light">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-dark-bg text-text-light shadow-sm"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-text-light">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-dark-bg text-text-light shadow-sm"
                />
            </div>
            <button type="submit" className="bg-purple text-text-light px-4 py-2 rounded shadow hover:bg-dark-purple">
                Register
            </button>
            <p className="text-text-light mt-4">
                Already have an account? <Link to="/login" className="text-purple">Login</Link>
            </p>
        </form>
    );
};

export default Register;
