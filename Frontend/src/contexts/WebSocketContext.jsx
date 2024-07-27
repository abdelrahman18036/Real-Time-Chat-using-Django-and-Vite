import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [messages, setMessages] = useState({});
    const [contacts, setContacts] = useState([]);
    const [pendingContacts, setPendingContacts] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [username, setUsername] = useState("");
    const socket = useRef(null);
    const reconnectInterval = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            fetchUserData(token);
            connectWebSocket(token);
            fetchContacts();
            fetchPendingContacts();
        }

        return () => {
            if (socket.current) {
                socket.current.close();
            }
            if (reconnectInterval.current) {
                clearInterval(reconnectInterval.current);
            }
        };
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get("http://localhost:8000/auth/users/me/", {
                headers: {
                    Authorization: `Token ${token}`
                }
            });
            setUsername(response.data.username);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const connectWebSocket = (token) => {
        const wsUrl = `ws://localhost:8000/ws/chat/?token=${token}`;

        const initWebSocket = () => {
            if (socket.current) {
                socket.current.close();
            }
            socket.current = new WebSocket(wsUrl);

            socket.current.onopen = () => {
                console.log("WebSocket connected");
                if (reconnectInterval.current) {
                    clearInterval(reconnectInterval.current);
                }
            };

            socket.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                const { sender, message, recipient } = data;
                const otherParty = sender === username ? recipient : sender;
                setMessages(prev => ({
                    ...prev,
                    [otherParty]: [...(prev[otherParty] || []), data]
                }));
                if (sender !== username) {
                    setUnreadCounts(prev => ({
                        ...prev,
                        [otherParty]: (prev[otherParty] || 0) + 1
                    }));
                }
            };

            socket.current.onclose = e => {
                console.log(`Socket is closed. Reconnect will be attempted in 1 second.`, e.reason);
                if (!reconnectInterval.current) {
                    reconnectInterval.current = setTimeout(() => {
                        console.log("Attempting to reconnect...");
                        initWebSocket();
                    }, 1000);
                }
            };

            socket.current.onerror = err => {
                console.error("WebSocket encountered error: ", err.message, "Closing socket");
                socket.current.close();
            };
        };

        initWebSocket();
    };

    const sendMessage = (message, contact) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            const data = { message, contact, sender: username, recipient: contact };
            socket.current.send(JSON.stringify(data));
            setMessages(prev => ({
                ...prev,
                [contact]: [...(prev[contact] || []), data]
            }));
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post("http://localhost:8000/auth/token/login/", { username, password });
            const token = response.data.auth_token;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            fetchUserData(token);
            connectWebSocket(token);
            fetchContacts();
            fetchPendingContacts();
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const register = async (username, password) => {
        try {
            const response = await axios.post("http://localhost:8000/auth/register/", { username, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            fetchUserData(token);
            connectWebSocket(token);
            fetchContacts();
            fetchPendingContacts();
        } catch (error) {
            console.error("Registration error:", error.response.data);
        }
    };

    const fetchContacts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/contacts/");
            setContacts(response.data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    const fetchPendingContacts = async () => {
        try {
            const response = await axios.get("http://localhost:8000/contacts/pending_requests/");
            setPendingContacts(response.data);
        } catch (error) {
            console.error("Error fetching pending contacts:", error);
        }
    };

    const sendContactRequest = async (username) => {
        try {
            const response = await axios.post("http://localhost:8000/contacts/send_request/", { username });
            fetchPendingContacts();
            fetchContacts();
        } catch (error) {
            console.error("Error sending contact request:", error);
        }
    };

    const acceptContactRequest = async (username) => {
        try {
            const response = await axios.post("http://localhost:8000/contacts/accept_request/", { username });
            fetchPendingContacts();
            fetchContacts();
        } catch (error) {
            console.error("Error accepting contact request:", error);
        }
    };

    const removeContact = async (username) => {
        try {
            const response = await axios.post("http://localhost:8000/contacts/remove_contact/", { username });
            fetchPendingContacts();
            fetchContacts();
        } catch (error) {
            console.error("Error removing contact:", error);
        }
    };

    return (
        <WebSocketContext.Provider value={{
            messages,
            sendMessage,
            login,
            register,
            contacts,
            pendingContacts,
            sendContactRequest,
            acceptContactRequest,
            removeContact,
            username,
            unreadCounts,
            setUnreadCounts
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};
