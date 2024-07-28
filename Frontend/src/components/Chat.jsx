// Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { toast } from 'react-toastify';
import { FaCircle } from 'react-icons/fa';
import { formatLastSeen } from "../utils/utils";

const Chat = () => {
    const { messages, sendMessage, contacts, username, unreadCounts, setUnreadCounts, onlineStatus, setOnlineStatus } = useWebSocket();
    const [selectedContact, setSelectedContact] = useState("");
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        if (selectedContact) {
            setUnreadCounts(prev => ({
                ...prev,
                [selectedContact]: 0
            }));
        }
    }, [messages, selectedContact]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            incrementLastSeenTimes();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [onlineStatus]);

    const incrementLastSeenTimes = () => {
        setOnlineStatus(prevStatus => {
            const updatedStatus = { ...prevStatus };
            Object.keys(updatedStatus).forEach(user => {
                if (!updatedStatus[user].is_online) {
                    const lastSeen = new Date(updatedStatus[user].last_seen);
                    updatedStatus[user].last_seen = new Date(lastSeen.getTime() - 100).toISOString();
                }
            });
            return updatedStatus;
        });
    };

    const handleSendMessage = () => {
        if (selectedContact && message.trim()) {
            sendMessage(message, selectedContact);
            setMessage("");
        } else {
            toast.error("Please select a contact and enter a message.");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const filteredMessages = messages[selectedContact] || [];

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 p-4 shadow-lg">
                <h1 className="text-2xl font-bold">Chat Application</h1>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-1/4 bg-gray-800 p-4 overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4">Contacts</h2>
                    <ul className="space-y-2">
                        {contacts.filter(c => c.accepted).map(contact => (
                            <li
                                key={contact.id}
                                onClick={() => {
                                    setSelectedContact(contact.other_party.username);
                                    setUnreadCounts(prev => ({
                                        ...prev,
                                        [contact.other_party.username]: 0
                                    }));
                                }}
                                className={`p-3 rounded cursor-pointer ${selectedContact === contact.other_party.username ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500 flex justify-between items-center`}
                            >
                                <span>{contact.other_party.username}</span>
                                <FaCircle className={`ml-2 ${onlineStatus[contact.other_party.username]?.is_online ? 'text-green-500' : 'text-gray-500'}`} />
                                {!onlineStatus[contact.other_party.username]?.is_online && (
                                    <span className="ml-2 text-sm text-gray-400">
                                        {formatLastSeen(onlineStatus[contact.other_party.username]?.last_seen)}
                                    </span>
                                )}
                                {unreadCounts[contact.other_party.username] > 0 && (
                                    <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                        {unreadCounts[contact.other_party.username]}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="flex-1 flex flex-col p-4 bg-gray-900 overflow-y-auto">
                    <div className="flex-1 mb-4">
                        <h2 className="text-lg font-bold mb-2">Messages</h2>
                        <ul className="space-y-2">
                            {filteredMessages.map((msg, index) => (
                                <li key={index} className={`p-2 rounded ${msg.sender === username ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start'}`}>
                                    <strong>{msg.sender === username ? "You" : msg.sender}: </strong>{msg.message}
                                </li>
                            ))}
                            <div ref={messagesEndRef} />
                        </ul>
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            onKeyPress={handleKeyPress}
                            className="flex-1 p-2 rounded-l-md border-gray-600 bg-gray-700 text-white"
                        />
                        <button
                            type="button"
                            onClick={handleSendMessage}
                            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                        >
                            Send
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Chat;
