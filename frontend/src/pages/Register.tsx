import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('anggota'); // Default role
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registrasi berhasil! Silakan login.');
        navigate('/login');
      } else {
        alert(data.message || 'Registrasi gagal');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan pada server');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: 'auto' }}>
      <h2>Daftar Akun</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Nama Lengkap" 
          value={nama} 
          onChange={(e) => setNama(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        {/* Pilihan Role */}
        <label style={{ fontSize: '14px', textAlign: 'left', marginBottom: '-5px' }}>Pilih Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '5px' }}>
          <option value="anggota">Anggota</option>
          <option value="petugas">Petugas</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={{ marginTop: '5px' }}>Daftar</button>
      </form>
      <p style={{ marginTop: '15px' }}>Sudah punya akun? <Link to="/login">Login di sini</Link></p>
    </div>
  );
}