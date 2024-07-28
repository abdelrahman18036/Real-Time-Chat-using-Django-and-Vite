// ContactManagement.jsx
import React, { useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { toast } from 'react-toastify';
import { FaCircle } from 'react-icons/fa';

const ContactManagement = () => {
    const [username, setUsername] = useState("");
    const { sendContactRequest, acceptContactRequest, removeContact, contacts, onlineStatus } = useWebSocket();

    const handleSendContactRequest = () => {
        if (!username.trim()) {
            toast.error("Please enter a username.");
            return;
        }
        sendContactRequest(username);
        setUsername("");
    };

    return (
        <div className="m-3 space-y-4 max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-4">Manage Contacts</h2>
            <div>
                <label className="block text-sm font-medium text-text-light">Add Contact</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-dark-bg text-text-light shadow-sm"
                />
                <button
                    onClick={handleSendContactRequest}
                    className="bg-purple text-text-light px-4 py-2 rounded shadow hover:bg-dark-purple mt-2"
                >
                    Send Contact Request
                </button>
            </div>
            <div>
                <h3 className="text-lg font-bold text-text-light mb-2">Pending Requests</h3>
                <ul className="space-y-2">
                    {contacts.filter(c => !c.accepted && c.user !== username).map(contact => (
                        <li key={contact.id} className="bg-dark-purple text-text-light p-2 rounded flex justify-between items-center">
                            {contact.other_party.username}
                            <button
                                onClick={() => acceptContactRequest(contact.other_party.username)}
                                className="bg-purple text-text-light px-4 py-2 rounded shadow hover:bg-dark-purple ml-2"
                            >
                                Accept
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-bold text-text-light mb-2">Contacts</h3>
                <ul className="space-y-2">
                    {contacts.filter(c => c.accepted).map(contact => (
                        <li key={contact.id} className="bg-dark-purple text-text-light p-2 rounded flex justify-between items-center">
                            <span>{contact.other_party.username}</span>
                            <span className="flex items-center">
                                <FaCircle className={`ml-2 ${onlineStatus[contact.other_party.username] ? 'text-green-500' : 'text-gray-500'}`} />
                                <button
                                    onClick={() => removeContact(contact.other_party.username)}
                                    className="bg-red-500 text-text-light px-4 py-2 rounded shadow hover:bg-red-700 ml-2"
                                >
                                    Remove
                                </button>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ContactManagement;
