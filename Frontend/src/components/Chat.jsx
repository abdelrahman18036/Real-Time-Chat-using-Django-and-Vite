import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { toast } from 'react-toastify';

const Chat = () => {
    const { messages, sendMessage, contacts, username, unreadCounts, setUnreadCounts } = useWebSocket();
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
        <div className="flex flex-col h-screen">
            <header className="bg-dark-purple p-4 text-light">
                <h1 className="text-2xl font-bold">Chat Application</h1>
            </header>
            <div className="flex flex-1">
                <aside className="w-1/4 bg-dark-bg p-4">
                    <h2 className="text-lg font-bold text-light mb-4">Contacts</h2>
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
                                className={`p-2 rounded cursor-pointer ${selectedContact === contact.other_party.username ? 'bg-purple' : 'bg-dark-bg'} text-light`}
                            >
                                {contact.other_party.username}
                                {unreadCounts[contact.other_party.username] > 0 && (
                                    <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                        {unreadCounts[contact.other_party.username]}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="flex-1 flex flex-col p-4 bg-dark-bg">
                    <div className="flex-1 overflow-auto mb-4">
                        <h2 className="text-lg font-bold text-light mb-2">Messages</h2>
                        <ul className="space-y-2 flex flex-col">
                            {filteredMessages.map((msg, index) => (
                                <li key={index} className={`message ${msg.sender === username ? 'right' : 'left'}`}>
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
                            className="flex-1 p-2 rounded-l-md border-gray-300 bg-dark-bg text-light"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={handleSendMessage}
                            className="bg-purple text-light px-4 py-2 rounded-r-md"
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
