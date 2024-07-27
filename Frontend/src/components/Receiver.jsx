import React from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

const ReceiverComponent = () => {
    const { messages } = useWebSocket();

    return (
        <div className='m-3'>
            <h3 className="text-lg font-bold mb-2">Received Messages:</h3>
            <ul className="list-disc pl-5">
                {messages.map((msg, index) => (
                    <li key={index} className="bg-dark-purple text-text-light p-2 mb-1 rounded">
                        {msg}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReceiverComponent;
