import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    TextField,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Button,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export default function () {
    const navigate = useNavigate();
    const [user, setUser] = useState("");
    // const [users, setUsers] = useState([]);
    // useEffect(() => {
    //     const getUsers = async () => {
    //         await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`, {
    //             withCredentials: true,
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json'
    //             }
    //         })
    //             .then(res => setUsers(res.data))
    //     }

    //     getUsers();
    // }, []);

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
            {/* <FormControl fullWidth>
                <InputLabel id="select-label">Usuários</InputLabel>
                <Select
                    className='mb-2'
                    labelId="select-label"
                    label="Usuários"
                    value={age}
                    onChange={handleChange}
                >
                    {users.map((u, index) => <MenuItem key={index} value={u.Nome}>{u.Nome}</MenuItem>)}
                </Select>
            </FormControl> */}
            <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => {
                    navigate("/Chat", { state: user })
                }}
            >
                Entrar no chat
            </Button>
        </div>
    )
}
