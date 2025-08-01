import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('previousMessages', (previousMessages) => {
            setMessages(previousMessages);
        });

        return () => {
            socket.off('newMessage');
            socket.off('previousMessages');
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit('sendMessage', input);
            setInput('');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Real-Time Chat</h2>
            <div style={{ border: '1px solid black', height: '300px', overflowY: 'scroll' }}>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;
