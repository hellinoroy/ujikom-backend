import { useEffect, useState } from 'react';

export default function Kategori() {
  const [kategori, setKategori] = useState([]);
  const [namaKategori, setNamaKategori] = useState('');
  const token = localStorage.getItem('token');

  const fetchKategori = async () => {
    const res = await fetch('http://localhost:8080/api/kategori', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setKategori(data);
  };

  useEffect(() => { fetchKategori(); }, []);

  const handleTambah = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/api/kategori', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nama_kategori: namaKategori })
    });
    if (res.ok) {
      setNamaKategori('');
      fetchKategori();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus kategori?')) return;
    await fetch(`http://localhost:8080/api/kategori/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchKategori();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manajemen Kategori</h2>
      
      <form onSubmit={handleTambah} style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Nama Kategori Baru" 
          value={namaKategori} 
          onChange={(e) => setNamaKategori(e.target.value)} 
          required 
        />
        <button type="submit" style={{ marginLeft: '10px' }}>Tambah Kategori</button>
      </form>

      <ul>
        {kategori.map((item) => (
          <li key={item.id} style={{ marginBottom: '10px' }}>
            {item.nama_kategori} 
            <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px', color: 'red' }}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
}