import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWebSocket } from "../contexts/WebSocketContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useWebSocket();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(username, password);
        navigate("/chat");
    };

    return (
        <form onSubmit={handleLogin} className="m-3 space-y-4 max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-4">Login</h2>
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
                Login
            </button>
            <p className="text-text-light mt-4">
                Don't have an account? <Link to="/register" className="text-purple">Register</Link>
            </p>
        </form>
    );
};

export default Login;
