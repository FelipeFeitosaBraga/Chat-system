import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    TextField,
    Button,
    Box,
    Typography,
    Container,
    Paper,
    Grid,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export default function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState("");

    return (
        <Container 
            maxWidth="sm" 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #000000 0%, #b71c1c 100%)', // Fundo degradê de preto para vermelho
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 2,
                    textAlign: 'center',
                    boxShadow: 3,
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escuro sem opacidade total
                    backdropFilter: 'blur(10px)', // Efeito de desfoque no fundo
                }}
            >
                <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#f44336' }}>
                    Chat - online
                </Typography>

                <Typography variant="body1" sx={{ marginBottom: 3, color: '#fff' }}>
                    Identifique-se
                </Typography>

                <TextField
                    fullWidth
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    label="User "
                    variant="outlined"
                    sx={{
                        marginBottom: 2,
                        input: {
                            color: '#fff', // Cor do texto do input
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#f44336', // Borda vermelha
                            },
                            '&:hover fieldset': {
                                borderColor: '#f44336', // Borda vermelha ao passar o mouse
                            },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<LoginIcon />}
                    sx={{
                        padding: '12px',
                        fontWeight: 'bold',
                        textTransform: 'none', // Remover transformação de texto para evitar letras maiúsculas automáticas
                        background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)', // Degradê vermelho no botão
                        '&:hover': {
                            background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)', // Degradê invertido no hover
                        },
                    }}
                    onClick={() => {
                        navigate("/Chat", { state: user })
                    }}
                >
                    Acessar Chat
                </Button>
            </Paper>
        </Container>
    )
}
