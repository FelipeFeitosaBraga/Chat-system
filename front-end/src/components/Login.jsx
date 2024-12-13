import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    TextField,
    Button,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export default function Login() {
    const navigate = useNavigate();
    const [user, setUser] = useState("");

    return (
        <div style={{ display: "flex", flexDirection: 'column', alignItems: 'center' }}>
            <h1 className='mb-2'>
                Login
            </h1>
            <TextField
                className='mb-2'
                value={user}
                onChange={(e) => setUser(e.target.value)}
                label="Usuário"
                variant="outlined"
            />
            <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => {
                    navigate("/Chat", { state: user })
                }}
            >
                Entrar
            </Button>
        </div>
    )
}
