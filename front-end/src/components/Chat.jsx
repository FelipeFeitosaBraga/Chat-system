import { useState, useEffect, useRef, Fragment } from "react";
import * as signalR from "@microsoft/signalr";
import {
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    Box,
    Typography,
    Divider,
    Select,
    MenuItem,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function Chat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]); // Lista de mensagens
    const [inputMessage, setInputMessage] = useState(''); // Mensagem digitada
    const connectionRef = useRef(null);
    const location = useLocation();
    const [user] = useState(location.state);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("geral");

    if (!location.state)
        navigate("/")

    const handleSendMessage = async () => {
        if (user && inputMessage) {
            try {
                const params = selectedUser == "geral" ? [user, inputMessage] : [user, selectedUser, inputMessage]
                await connectionRef.current.invoke(selectedUser == "geral" ? "SendMessage" : "SendMessageTo", ...params)
                setInputMessage("");
                refreshMessages(selectedUser);
            } catch (err) {
                console.error("Error sending message:", err);
            }
        }
    };

    const getUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`);
            console.log(response);
            setUsers(response.data);
        } catch (error) {
            console.error(error)
        }
    };

    const refreshMessages = async (userSelected) => {
        const endpoint = userSelected == 'geral' ? '/all' : `?de=${user}&para=${userSelected}`;
        const url = `${import.meta.env.VITE_API_BASE_URL}/messages${endpoint}`;
        try {
            const result = await axios.get(url);
            const msgs = result.data.map(({ de, texto }) => ({
                sender: de == user ? "Você" : de,
                text: texto
            }));
            setMessages(() => msgs)
        } catch (error) {
            console.error(error)
        } finally {
            console.log({ url, userSelected });
        }
    }

    const handleSetSelectedUser = async (e) => {
        setSelectedUser(() => e.target.value);
        refreshMessages(e.target.value);
    }

    const scrollToBottom = () => {
        const chatContainer = document.querySelector('[role="presentation"]');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_BASE_URL}/chatHub?user=${user}`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .build();

        connectionRef.current = connection;

        const connectSignalR = async () => {
            if (connection.state === signalR.HubConnectionState.Disconnected) {
                try {
                    await connection.start();
                    console.log("SignalR connected!");

                    connection.on("ReceiveMessage", () => {
                        refreshMessages(selectedUser)
                    });

                    connection.on("ReceiveMessageFrom", () => {
                        refreshMessages(selectedUser)
                    });
                } catch (err) {
                    console.error("Error connecting to SignalR:", err);
                }
            }
        };

        const initializeMessages = async () => {
            await handleSetSelectedUser({ target: { value: 'geral' } });
        }

        connectSignalR();
        getUsers();
        initializeMessages();
        scrollToBottom();

        return () => {
            if (connectionRef.current) {
                connectionRef.current.off("ReceiveMessage");
                connectionRef.current.stop();
            }
        };
    }, [user]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '400px',
                height: '600px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                    padding: '10px',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6">Chat - Usuário: {user}</Typography>

                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: "center" }}>
                    <Select
                        value={selectedUser}
                        onChange={handleSetSelectedUser}
                        variant="outlined"
                        size="small"
                        defaultValue="geral"
                        sx={{ backgroundColor: '#fff', color: '#000', borderRadius: '4px' }}
                    >
                        <MenuItem value="geral">Geral</MenuItem>
                        {
                            users
                                .filter(({ nome }) => nome != user)
                                .map(({ id, nome }) => (<MenuItem key={id} value={nome}>{nome}</MenuItem>))
                        }
                    </Select>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={getUsers}
                    >
                        Refresh
                    </Button>
                </Box>

            </Box>

            <Box
                sx={{
                    flex: 1,
                    padding: '10px',
                    overflowY: 'auto',
                    backgroundColor: '#f5f5f5',
                    maxHeight: 'calc(100% - 140px)',
                }}
                role="presentation"
            >
                <List>
                    {messages.map((message, index) => (
                        <Fragment key={index}>
                            <ListItem className="pt-1 pb-1">
                                <ListItemText
                                    className={message.sender === 'Você' ? 'text-end' : ''}
                                    primary={<Typography variant="body2" color="textSecondary">{message.sender}</Typography>}
                                    secondary={<Typography variant="body1">{message.text}</Typography>}
                                />
                            </ListItem>
                            {index < messages.length - 1 && <Divider />}
                        </Fragment>
                    ))}
                </List>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    padding: '10px',
                    borderTop: '1px solid #ccc',
                }}
            >
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    sx={{ marginLeft: '10px' }}
                >
                    Enviar
                </Button>
            </Box>
        </Box >
    );
};
