import React, { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { Button, TextField, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';

export default function () {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(location.state);
    const connectionRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cria a conexão com a URL e passa o nome do usuário como parâmetro
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_BASE_URL}/chatHub?user=${user}`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;

        if (connection.state === signalR.HubConnectionState.Disconnected) {
            connection
                .start()
                .then(() => {
                    console.log("SignalR connected!");
                    setLoading(false);
                    connection.on("ReceiveMessage", (user, message) => {
                        setMessages((prevMessages) => [...prevMessages, { user, message }]);
                    });
                })
                .catch((err) => console.error("Error connecting to SignalR:", err));
        }

        return () => {
            if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
                connectionRef.current.stop();
            }
        };
    }, [user]);  // Dependência do user

    const sendMessage = async () => {
        if (user && message) {
            try {
                await connectionRef.current.invoke("SendMessage", user, message);  // Envia o nome do usuário junto com a mensagem
                setMessage("");
            } catch (err) {
                console.error("Error sending message:", err);
            }
        }
    };

    return (
        <div>
            <h1>React + SignalR Chat</h1>
            {
                loading ? <CircularProgress /> :
                    <>
                        <div>
                            <TextField
                                value={user}
                                onChange={(e) => {
                                    console.log(e)
                                    setUser(e.target.value)
                                }}
                                label="User"
                                variant="outlined"
                            />
                            <TextField
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                label="Message"
                                variant="outlined"
                            />
                            <Button onClick={sendMessage} variant="contained">Hello world</Button>
                        </div>
                        <ul>
                            {messages.map((msg, index) => (
                                <li key={index}>
                                    <strong>{msg.user}:</strong> {msg.message}
                                </li>
                            ))}
                        </ul>
                    </>
            }
        </div>
    );

}