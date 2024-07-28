import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { toast } from 'react-toastify';
import { Reorder } from "framer-motion";
import { formatLastSeen } from "../utils/utils";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsEmojiWink, BsPencilSquare, BsSearch } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import Darkimg from '../assets/images/dark-background.jpg';
import Lightimg from '../assets/images/light-background.jpg';
import { useTheme } from "../contexts/ThemeContext";
import Header from '../components/Header';

const Chat = () => {
    const { messages, sendMessage, contacts, username, unreadCounts, setUnreadCounts, onlineStatus, setOnlineStatus } = useWebSocket();
    const [selectedContact, setSelectedContact] = useState("");
    const [message, setMessage] = useState("");
    const [reorderedContacts, setReorderedContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [linkPreviews, setLinkPreviews] = useState({});
    const messagesEndRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        console.log("Fetched contacts from context:", contacts); // Debugging statement
        const savedOrder = JSON.parse(localStorage.getItem('contactOrder'));
        if (contacts.length > 0) {
            let orderedContacts = [];
            if (savedOrder && savedOrder.length > 0) {
                orderedContacts = savedOrder.map(id => contacts.find(contact => contact.id === id)).filter(contact => contact);
                console.log("Ordered contacts based on saved order:", orderedContacts); // Debugging statement
            }
            // Set to original contacts if reordering results in an empty array
            if (orderedContacts.length === 0) {
                orderedContacts = contacts;
                console.log("Setting contacts without order:", contacts); // Debugging statement
            }
            setReorderedContacts(orderedContacts);
            setLoading(false);
        }
    }, [contacts]);



    useEffect(() => {
        if (reorderedContacts.length > 0) {
            localStorage.setItem('contactOrder', JSON.stringify(reorderedContacts.map(contact => contact.id)));
        }
    }, [reorderedContacts]);

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
                    updatedStatus[user].last_seen = new Date(lastSeen.getTime() + 1000).toISOString();
                }
            });
            return updatedStatus;
        });
    };

    const fetchLinkPreview = async (url) => {
        try {
            const response = await fetch(`https://api.linkpreview.net/?key=93a5dbaab206659d97bd5be328a1960e&q=${url}`);
            const data = await response.json();
            setLinkPreviews(prev => ({ ...prev, [url]: data }));
        } catch (error) {
            console.error('Error fetching link preview:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (selectedContact && message.trim()) {
            sendMessage(message, selectedContact);

            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const urls = message.match(urlRegex);
            if (urls) {
                urls.forEach(url => fetchLinkPreview(url));
            }

            setMessage("");
            setShowEmojiPicker(false);
        } else {
            toast.error("Please select a contact and enter a message.");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage(e);
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
    };

    const filteredMessages = messages[selectedContact] || [];
    const backgroundImage = theme === 'dark' ? Darkimg : Lightimg;

    return (
        <div className={`grid h-full place-items-center h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>

            <div className='relative m-auto flex max-h-[1080px] w-screen max-w-screen-xl md:h-[90vh] md:w-[90vw] lg:h-[85vh] lg:w-[95vw] xl:w-[70vw] 2xl:w-[95vw]'>
                <div className={`absolute left-0 top-0 flex h-full w-full flex-col justify-between rounded-tl-lg rounded-bl-lg ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'} backdrop-blur-xl md:static md:w-[70%] lg:w-[60%]`}>
                    <div className="flex items-center justify-between p-4">
                        <ul className="flex space-x-2 [&>li]:h-3 [&>li]:w-3 [&>li]:cursor-pointer [&>li]:rounded-full [&>li]:border [&>li]:border-black/10">
                            <li className="bg-red-400"></li>
                            <li className="bg-yellow-400"></li>
                            <li className="bg-green-400"></li>
                        </ul>
                        <BsPencilSquare className="pointer-cursor cursor-pointer text-xl text-system-gray-dark-2" />
                    </div>
                    <div className="relative flex h-full flex-col space-y-5 overflow-y-auto px-4 pb-5">
                        <form className="relative mt-5 flex">
                            <BsSearch className="absolute left-3 top-1/3 text-[#827478]" />
                            <input
                                maxLength={70}
                                type="search"
                                placeholder="Search"
                                className={`w-full rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'} py-2 pl-8 pr-5 outline-none placeholder:text-[#827478]`}
                            />
                        </form>
                        <div>
                            {loading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div key={item} className="p-3 rounded cursor-pointer skeleton">
                                            <div className="flex justify-between items-center">
                                                <span className="skeleton-text w-24"></span>
                                                <span className="skeleton-circle"></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Reorder.Group
                                    axis="y"
                                    values={reorderedContacts}
                                    onReorder={setReorderedContacts}
                                    className="space-y-2"
                                >
                                    {reorderedContacts.length === 0 && (
                                        <div className="p-3 rounded bg-gray-200 text-center">
                                            No contacts found.
                                        </div>
                                    )}
                                    {reorderedContacts.filter(c => c.accepted).map(contact => (
                                        <Reorder.Item key={contact.id} value={contact}>
                                            <div
                                                onClick={() => {
                                                    setSelectedContact(contact.other_party.username);
                                                    setUnreadCounts(prev => ({
                                                        ...prev,
                                                        [contact.other_party.username]: 0
                                                    }));
                                                }}
                                                className={`p-3 rounded cursor-pointer ${selectedContact === contact.other_party.username ? 'bg-gray-400' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} hover:bg-gray-500 dark:hover:bg-gray-300 flex justify-between items-center`}
                                            >
                                                <span className="dark:text-white">{contact.other_party.username}</span>
                                                {onlineStatus[contact.other_party.username]?.is_online ? (
                                                    <FaCircle className="text-green-400 text-xs" />
                                                ) : (
                                                    <span className="ml-2 text-sm text-gray-400 dark:text-gray-400">
                                                        Last seen {formatLastSeen(onlineStatus[contact.other_party.username]?.last_seen)}
                                                    </span>
                                                )}
                                                {unreadCounts[contact.other_party.username] > 0 && (
                                                    <span className="ml-2 bg-red-500 text-white dark:bg-red-300 px-2 py-1 rounded-full text-xs">
                                                        {unreadCounts[contact.other_party.username]}
                                                    </span>
                                                )}
                                            </div>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            )}
                        </div>


                    </div>
                </div>
                <div className={`z-[11] flex h-screen w-full flex-col overflow-hidden rounded-tr-lg rounded-br-lg border-l-[1.5px] border-gray-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-500' : 'bg-white'} md:h-full`}>
                    <div className="z-10 flex w-full justify-between rounded-tr-lg border-b-[1.5px] border-gray-300 dark:border-gray-500  bg-system-gray-5 px-5 pt-7 pb-3 md:px-8">
                        <div>
                            <span className="text-system-gray-1">To: </span>{" "}
                            <span className="font-medium">{selectedContact || "Select a contact"}</span>
                        </div>
                        <button type="button" className="cursor-pointer text-system-blue">
                            Profile
                        </button>
                    </div>
                    <div className="scroll-container h-full w-full overflow-x-hidden overflow-y-scroll scroll-smooth py-3 px-6">
                        <p className="my-10 text-center text-system-gray-1">
                            Maximum of 25 messages are shown.
                        </p>
                        <ul className="space-y-2">
                            {filteredMessages.map((msg, index) => (
                                <li key={index} className={`flex ${msg.sender === username ? "justify-end" : "justify-start"}`}>
                                    <div className={`p inline-block ${msg.sender === username ? "send" : "receive"}`}>
                                        <strong hidden>{msg.sender === username ? "You" : msg.sender}: </strong>{msg.message}
                                        {msg.message.match(/https?:\/\/[^\s]+/) && linkPreviews[msg.message.match(/https?:\/\/[^\s]+/)[0]] && (
                                            <a href={msg.message.match(/https?:\/\/[^\s]+/)[0]} target="_blank" rel="noopener noreferrer" className="block mt-2">
                                                <div className="border rounded overflow-hidden">
                                                    <img src={linkPreviews[msg.message.match(/https?:\/\/[^\s]+/)[0]].image} alt="" className="w-full h-auto object-cover" />
                                                    <div className="p-2">
                                                        <h3 className="text-sm font-semibold">{linkPreviews[msg.message.match(/https?:\/\/[^\s]+/)[0]].title}</h3>
                                                        <p className="text-xs">{linkPreviews[msg.message.match(/https?:\/\/[^\s]+/)[0]].description}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </li>
                            ))}
                            <div ref={messagesEndRef} />
                        </ul>

                    </div>
                    <div className="flex w-full items-center justify-between space-x-3 rounded-br-lg border-t-[1.5px] border-gray-300 dark:border-gray-500 bg-system-gray-6 p-5">
                        <div className="icons flex items-center space-x-3 text-system-gray-dark-1">
                            <AiFillPlusCircle className="cursor-pointer text-[1.7rem]" />
                        </div>
                        <form onSubmit={handleSendMessage} className="relative flex w-full">
                            <input
                                type="text"
                                maxLength={355}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Aa"
                                className={`w-full rounded-full border-2 ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'} py-1 pl-5 pr-11 text-xl outline-none`}
                            />
                            <button className="absolute top-1/4 right-5 cursor-pointer text-xl text-system-blue">
                                <RiSendPlaneFill />
                            </button>
                        </form>
                        <BsEmojiWink className="cursor-pointer text-4xl text-system-gray-dark-2 md:text-3xl" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                    </div>
                    {showEmojiPicker && (
                        <div className="absolute bottom-20 right-10">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Chat;
