import React, { useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

const SenderComponent = () => {
    const [message, setMessage] = useState("");
    const { sendMessage } = useWebSocket();

    return (
        <div className='m-3'>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-light">Enter Your Message</label>
                    <input
                        type='text'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Type a message...'
                        className="mt-1 block w-full rounded-md border-gray-300 bg-dark-bg text-text-light shadow-sm focus:border-purple focus:ring-purple sm:text-sm"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => sendMessage(message)}
                    className="bg-purple text-text-light px-4 py-2 rounded shadow hover:bg-dark-purple"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default SenderComponent;
