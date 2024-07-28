import React, { useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { toast } from 'react-toastify';
import { FaCheck, FaTimes, FaCircle } from 'react-icons/fa';
import { formatLastSeen } from "../utils/utils";

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
        <div className="m-6 p-6 bg-gray-800 rounded-lg text-white shadow-md">
            <h2 className="text-3xl font-bold mb-6">Manage Contacts</h2>
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Add Contact</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 mb-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
                />
                <button
                    onClick={handleSendContactRequest}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                    Send Contact Request
                </button>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Pending Requests</h3>
                <ul className="space-y-4">
                    {contacts.filter(c => !c.accepted).map(contact => (
                        <li key={contact.id} className="p-4 bg-gray-700 rounded flex justify-between items-center">
                            <span>{contact.other_party.username}</span>
                            <div className="flex items-center">
                                <button
                                    onClick={() => acceptContactRequest(contact.other_party.username)}
                                    className="p-2 bg-green-500 hover:bg-green-600 rounded-full text-white"
                                >
                                    <FaCheck />
                                </button>
                                <button
                                    onClick={() => removeContact(contact.other_party.username)}
                                    className="p-2 ml-2 bg-red-500 hover:bg-red-600 rounded-full text-white"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-bold mb-4">Contacts</h3>
                <ul className="space-y-4">
                    {contacts.filter(c => c.accepted).map(contact => (
                        <li key={contact.id} className="p-4 bg-gray-700 rounded flex justify-between items-center">
                            <span>{contact.other_party.username}</span>
                            <div className="flex items-center">
                                <FaCircle className={`ml-2 ${onlineStatus[contact.other_party.username]?.is_online ? 'text-green-500' : 'text-gray-500'}`} />
                                {!onlineStatus[contact.other_party.username]?.is_online && (
                                    <span className="ml-2 text-sm text-gray-400">
                                        {formatLastSeen(onlineStatus[contact.other_party.username]?.last_seen)}
                                    </span>
                                )}
                                <button
                                    onClick={() => removeContact(contact.other_party.username)}
                                    className="p-2 ml-2 bg-red-500 hover:bg-red-600 rounded-full text-white"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ContactManagement;