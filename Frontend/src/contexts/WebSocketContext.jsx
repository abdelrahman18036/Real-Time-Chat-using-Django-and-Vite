import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [messages, setMessages] = useState({});
    const [contacts, setContacts] = useState([]);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [username, setUsername] = useState("");
    const [onlineStatus, setOnlineStatus] = useState({});
    const socket = useRef(null);
    const onlineSocket = useRef(null);
    const reconnectTimeout = useRef(null);
    const onlineReconnectTimeout = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            fetchUserData(token);
            connectWebSocket(token);
            connectOnlineStatusWebSocket(token);
            fetchContacts();
        }

        return () => {
            if (socket.current) {
                socket.current.close();
            }
            if (onlineSocket.current) {
                onlineSocket.current.close();
            }
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
            if (onlineReconnectTimeout.current) {
                clearTimeout(onlineReconnectTimeout.current);
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
        if (socket.current) {
            socket.current.close();
        }

        const wsUrl = `ws://localhost:8000/ws/chat/?token=${token}`;
        socket.current = new WebSocket(wsUrl);

        socket.current.onopen = () => {
            console.log("WebSocket connected");
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
                reconnectTimeout.current = null;
            }
        };

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received WebSocket message:", data);
            if (data.type === 'chat_message') {
                const { sender, message } = data;
                const otherParty = sender === username ? data.recipient : sender;
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
            } else if (data.type === 'online_status') {
                setOnlineStatus(data.online_status);
            }
        };

        socket.current.onclose = e => {
            console.log(`Socket is closed. Reconnect will be attempted in 1 second.`, e.reason);
            if (!reconnectTimeout.current) {
                reconnectTimeout.current = setTimeout(() => {
                    connectWebSocket(token);
                }, 1000);
            }
        };

        socket.current.onerror = err => {
            console.error("WebSocket encountered error: ", err.message, "Closing socket");
            socket.current.close();
        };
    };

    const connectOnlineStatusWebSocket = (token) => {
        if (onlineSocket.current) {
            onlineSocket.current.close();
        }

        const wsUrl = `ws://localhost:8000/ws/online/?token=${token}`;
        onlineSocket.current = new WebSocket(wsUrl);

        onlineSocket.current.onopen = () => {
            console.log("Online status WebSocket connected");
            if (onlineReconnectTimeout.current) {
                clearTimeout(onlineReconnectTimeout.current);
                onlineReconnectTimeout.current = null;
            }
        };

        onlineSocket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received online status message:", data);
            if (data.type === 'online_status') {
                setOnlineStatus(data.online_status);
            }
        };

        onlineSocket.current.onclose = e => {
            console.log(`Online status socket is closed. Reconnect will be attempted in 1 second.`, e.reason);
            if (!onlineReconnectTimeout.current) {
                onlineReconnectTimeout.current = setTimeout(() => {
                    connectOnlineStatusWebSocket(token);
                }, 1000);
            }
        };

        onlineSocket.current.onerror = err => {
            console.error("Online status WebSocket encountered error: ", err.message, "Closing socket");
            onlineSocket.current.close();
        };
    };

    const sendMessage = (message, contact) => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            console.log("Sending message:", message);
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
            connectOnlineStatusWebSocket(token);
            fetchContacts();
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
            connectOnlineStatusWebSocket(token);
            fetchContacts();
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

    const sendContactRequest = async (username) => {
        try {
            const response = await axios.post("http://localhost:8000/contacts/send_request/", { username });
            console.log(response.data);
            fetchContacts();
        } catch (error) {
            console.error("Error sending contact request:", error);
        }
    };

    const acceptContactRequest = async (username) => {
        try {
            const response = await axios.post("http://localhost:8000/contacts/accept_request/", { username });
            console.log(response.data);
            fetchContacts();
        } catch (error) {
            console.error("Error accepting contact request:", error);
        }
    };

    const removeContact = async (username) => {
        try {
            const response = await axios.post("http://localhost:8000/contacts/remove_contact/", { username });
            console.log(response.data);
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
            sendContactRequest,
            acceptContactRequest,
            removeContact,
            username,
            unreadCounts,
            setUnreadCounts,
            onlineStatus
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};
