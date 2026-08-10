import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Buku from './pages/Buku';
import Kategori from './pages/Kategori';
import Peminjaman from './pages/Peminjaman';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  // Komponen Navigasi Sederhana
  const Navbar = () => (
    <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px', display: 'flex', gap: '15px' }}>
      <Link to="/buku">Buku</Link>
      <Link to="/kategori">Kategori</Link>
      <Link to="/peminjaman">Peminjaman</Link>
      <button onClick={() => { localStorage.removeItem('token'); window.location.href='/login'; }}>
        Logout
      </button>
    </nav>
  );

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/buku" element={<Buku />} />
        <Route path="/kategori" element={<Kategori />} />
        <Route path="/peminjaman" element={<Peminjaman />} />
      </Routes>
    </Router>
  );
}

export default App;