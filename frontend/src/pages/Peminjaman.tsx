import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Peminjaman() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [filterUser, setFilterUser] = useState('');
  const [filterBuku, setFilterBuku] = useState('');
  const [userId, setUserId] = useState('');
  const [bukuId, setBukuId] = useState('');
  const token = localStorage.getItem('token');

  const fetchPeminjaman = async (params = {}) => {
    let url = 'http://localhost:8080/api/peminjam';
    const query = new URLSearchParams(params).toString();
    if (query) url += `?${query}`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setPeminjaman(Array.isArray(data) ? data : [data]);
    else setPeminjaman([]);
  };

  useEffect(() => { fetchPeminjaman(); }, []);

  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '-';
    if (String(dateString).includes('T')) {
      const dateObj = new Date(dateString);
      if (!isNaN(dateObj)) {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
      }
    }
    return dateString;
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const params = {};
    if (filterUser) params.user_id = filterUser;
    if (filterBuku) params.buku_id = filterBuku;
    fetchPeminjaman(params);
  };

  const handlePinjam = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8080/api/peminjam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      // Karena buku_id berupa string, jangan gunakan parseInt()
      body: JSON.stringify({ user_id: parseInt(userId), buku_id: bukuId })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Berhasil dipinjam!');
      setUserId('');
      setBukuId('');
      fetchPeminjaman();
    } else {
      alert(data.message || 'Gagal meminjam buku.');
    }
  };

  const handleKembalikan = async (id, uid) => {
    if (!window.confirm('Kembalikan buku ini?')) return;
    const res = await fetch(`http://localhost:8080/api/peminjam/return/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ user_id: uid })
    });
    
    const data = await res.json();
    if (res.ok) {
      alert(`Buku dikembalikan! Denda: Rp ${data.data.denda || 0}`);
      fetchPeminjaman();
    } else {
      alert(data.message || 'Gagal mengembalikan buku.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Transaksi Peminjaman</h2>
      
      <form onSubmit={handleFilter} style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <input placeholder="Filter User ID" type="number" value={filterUser} onChange={(e) => setFilterUser(e.target.value)} />
        <input placeholder="Filter Buku ID" type="text" value={filterBuku} onChange={(e) => setFilterBuku(e.target.value)} />
        <button type="submit">Cari / Filter</button>
        <button type="button" onClick={() => { setFilterUser(''); setFilterBuku(''); fetchPeminjaman(); }}>Reset</button>
      </form>

      <form onSubmit={handlePinjam} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input placeholder="User ID" type="number" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        <input placeholder="Buku ID" type="text" value={bukuId} onChange={(e) => setBukuId(e.target.value)} required />
        <button type="submit">Pinjam Buku</button>
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>ID Pinjam</th>
            <th>User ID</th>
            <th>Buku ID</th>
            <th>Tanggal Pinjam</th>
            <th>Tanggal Jatuh Tempo</th>
            <th>Tanggal Kembali</th>
            <th>Status</th>
            <th>Denda</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {peminjaman.length > 0 ? peminjaman.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.user_id}</td>
              <td>
                <Link to={`/buku?id=${item.buku_id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                  {item.buku_id}
                </Link>
              </td>
              <td>{formatDateToDDMMYYYY(item.tanggal_pinjam)}</td>
              <td>{formatDateToDDMMYYYY(item.tanggal_jatuh_tempo)}</td>
              <td>{formatDateToDDMMYYYY(item.tanggal_kembali)}</td>
              <td style={{ color: item.status === 'dipinjam' ? 'orange' : 'green' }}>{item.status}</td>
              <td>Rp {item.denda || 0}</td>
              <td>
                {item.status === 'dipinjam' && (
                  <button onClick={() => handleKembalikan(item.id, item.user_id)} style={{ background: '#4CAF50', color: 'white' }}>
                    Kembalikan
                  </button>
                )}
              </td>
            </tr>
          )) : <tr><td colSpan="9" style={{ textAlign: 'center' }}>Tidak ada data</td></tr>}
        </tbody>
      </table>
    </div>
  );
}