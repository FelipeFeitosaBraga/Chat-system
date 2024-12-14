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

    if (!location.state) navigate("/");

    const handleSendMessage = async () => {
        if (user && inputMessage) {
            try {
                const params = selectedUser === "geral" ? [user, inputMessage] : [user, selectedUser, inputMessage];
                await connectionRef.current.invoke(selectedUser === "geral" ? "SendMessage" : "SendMessageTo", ...params);
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
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const refreshMessages = async (userSelected) => {
        const endpoint = userSelected === 'geral' ? '/all' : `?de=${user}&para=${userSelected}`;
        const url = `${import.meta.env.VITE_API_BASE_URL}/messages${endpoint}`;
        try {
            const result = await axios.get(url);
            const msgs = result.data.map(({ de, texto }) => ({
                sender: de === user ? "Você" : de,
                text: texto
            }));
            setMessages(() => msgs);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSetSelectedUser = async (e) => {
        setSelectedUser(() => e.target.value);
        refreshMessages(e.target.value);
    };

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

                    connection.on("ReceiveMessage", (sender, message) => {
                        if (sender === "Sistema") {
                            setMessages((prevMessages) => [...prevMessages, { sender: "Sistema", text: message }]);
                        } else {
                            refreshMessages(selectedUser);
                        }
                    });

                    connection.on("ReceiveMessageFrom", (senderId, message) => {
                        refreshMessages(selectedUser);
                    });
                } catch (err) {
                    console.error("Error connecting to SignalR:", err);
                }
            }
        };

        const initializeMessages = async () => {
            await handleSetSelectedUser({ target: { value: 'geral' } });
        };

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

    // Função para gerar uma cor aleatória para cada usuário
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '400px',
                height: '600px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                background: '#121212', // Tema escuro
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#B71C1C', // Detalhes vermelhos
                    color: '#fff',
                    padding: '12px',
                    textAlign: 'center',
                    borderBottom: '2px solid #FF1744', // Bordas vermelhas
                }}
            >
                <Typography variant="h6" fontWeight="bold" fontSize="1.2rem">
                    Chat - Usuário: {user}
                </Typography>

                <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
                    <Select
                        value={selectedUser}
                        onChange={handleSetSelectedUser}
                        variant="outlined"
                        size="small"
                        sx={{ backgroundColor: '#fff', color: '#000', borderRadius: '4px' }}
                    >
                        <MenuItem value="geral">Geral</MenuItem>
                        {
                            users
                                .filter(({ nome }) => nome !== user)
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
                    padding: '12px',
                    overflowY: 'auto',
                    backgroundColor: '#1c1c1c', // Fundo escuro
                    maxHeight: 'calc(100% - 140px)',
                    boxShadow: 'inset 0 -1px 3px rgba(0, 0, 0, 0.1)',
                }}
                role="presentation"
            >
                <List>
                    {messages.map((message, index) => (
                        <Fragment key={index}>
                            <ListItem className="pt-1 pb-1">
                                <ListItemText
                                    className={message.sender === 'Você' ? 'text-end' : ''}
                                    primary={
                                        <Typography variant="body2" color="textSecondary" sx={{ color: message.sender === 'Você' ? 'red' : getRandomColor() }}>
                                            {message.sender}
                                        </Typography>
                                    }
                                    secondary={<Typography variant="body1" sx={{ color: '#fff' }}>{message.text}</Typography>}
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
                    padding: '12px',
                    borderTop: '1px solid #ccc',
                    backgroundColor: '#1c1c1c', // Fundo escuro para a entrada de mensagens
                }}
            >
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    sx={{
                        borderRadius: '25px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '25px',
                        },
                        backgroundColor: '#333',
                        color: '#fff',
                    }}
                />
                <Button
                    variant="contained"
                    color="error" // Detalhes vermelhos
                    onClick={handleSendMessage}
                    sx={{
                        marginLeft: '12px',
                        borderRadius: '25px',
                        paddingX: '20px',
                    }}
                >
                    Enviar
                </Button>
            </Box>
        </Box >
    );
};