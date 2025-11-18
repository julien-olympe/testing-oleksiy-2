import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { MyRings } from './pages/MyRings';
import { RingChat } from './pages/RingChat';
import { FindRing } from './pages/FindRing';
import { CreateRing } from './pages/CreateRing';
import { Settings } from './pages/Settings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/my-rings" element={<MyRings />} />
        <Route path="/rings/:id" element={<RingChat />} />
        <Route path="/find-ring" element={<FindRing />} />
        <Route path="/create-ring" element={<CreateRing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
