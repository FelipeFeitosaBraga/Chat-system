import Login from "./components/Login";
import Chat from "./components/Chat";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function App() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
        </Routes>
    </BrowserRouter>
}

export default App;
