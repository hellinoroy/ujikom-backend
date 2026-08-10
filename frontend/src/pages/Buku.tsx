import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Buku() {
  const [buku, setBuku] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
    const [searchParams] = useSearchParams(); // Hook untuk membaca query param dari URL
    
    const [search, setSearch] = useState({ 
        id: searchParams.get('id') || '', // Ambil nilai 'id' dari URL jika ada
        judul: '', 
        penulis: '', 
        penerbit: '', 
        tahun_terbit: '', 
        kategori_id: '' 
    });
  const [form, setForm] = useState({ id: '', judul: '', penulis: '', penerbit: '', stok: '', tahun_terbit: '', kategori_id: '' });
  const [isEdit, setIsEdit] = useState(false);
  const token = localStorage.getItem('token');

  const fetchBuku = async (queryParams = {}) => {
    let url = 'http://localhost:8080/api/buku';
    const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(([_, v]) => v !== ''));
    const query = new URLSearchParams(filteredParams).toString();
    
    if (query) url += `?${query}`;

    const res = await fetch(url);
    const data = await res.json();
    if (res.ok) setBuku(Array.isArray(data) ? data : [data]);
    else setBuku([]);
  };

  const fetchKategori = async () => {
    const res = await fetch('http://localhost:8080/api/kategori', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) setKategoriList(data);
  };

useEffect(() => { 
    // Cek apakah ada parameter 'id' di URL saat komponen dimuat
    const idFromUrl = searchParams.get('id');
    const initialQuery = {
      id: idFromUrl || '',
      judul: '',
      penulis: '',
      penerbit: '',
      tahun_terbit: '',
      kategori_id: ''
    };

    fetchBuku(initialQuery); 
    fetchKategori();
  }, [searchParams]); // Jalankan ulang jika URL berubah

  // Fungsi untuk memformat ISO string / tahun dari DB menjadi dd-mm-yyyy
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '-';
    
    // Jika format dari database ISO (contoh: 2005-01-01T00:00:00.000Z)
    if (String(dateString).includes('T')) {
      const dateObj = new Date(dateString);
      if (!isNaN(dateObj)) {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}-${month}-${year}`;
      }
    }
    
    // Jika format dari database hanya tahun (contoh: "2005")
    if (String(dateString).length === 4) {
      return `01-01-${dateString}`;
    }

    return dateString;
  };

  // Helper untuk mencari Nama Kategori berdasarkan ID
  const getNamaKategori = (kategoriId) => {
    const kategori = kategoriList.find((kat) => kat.id == kategoriId);
    return kategori ? kategori.nama_kategori : `ID: ${kategoriId}`;
  };

  const handleSearchChange = (e) => setSearch({ ...search, [e.target.name]: e.target.value });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBuku(search);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit ? `http://localhost:8080/api/buku/${form.id}` : 'http://localhost:8080/api/buku';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert(isEdit ? 'Buku diperbarui!' : 'Buku ditambahkan!');
      setForm({ id: '', judul: '', penulis: '', penerbit: '', stok: '', tahun_terbit: '', kategori_id: '' });
      setIsEdit(false);
      fetchBuku();
    } else {
      alert('Gagal menyimpan buku.');
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setIsEdit(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus?')) return;
    const res = await fetch(`http://localhost:8080/api/buku/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Buku dihapus!');
      fetchBuku();
    } else {
      alert('Gagal menghapus buku.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Manajemen Buku</h2>

      {/* Form Pencarian */}
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '15px', display: 'flex', gap: '8px', flexWrap: 'wrap', background: '#f9f9f9', padding: '10px', border: '1px solid #ddd' }}>
        <input name="id" placeholder="Cari ID" value={search.id} onChange={handleSearchChange} style={{ width: '80px' }} />
        <input name="judul" placeholder="Cari Judul" value={search.judul} onChange={handleSearchChange} />
        <input name="penulis" placeholder="Cari Penulis" value={search.penulis} onChange={handleSearchChange} />
        <input name="penerbit" placeholder="Cari Penerbit" value={search.penerbit} onChange={handleSearchChange} />
        <input name="tahun_terbit" placeholder="Tahun" value={search.tahun_terbit} onChange={handleSearchChange} style={{ width: '80px' }} />
        <select name="kategori_id" value={search.kategori_id} onChange={handleSearchChange}>
          <option value="">Semua Kategori</option>
          {kategoriList.map((kat) => (
            <option key={kat.id} value={kat.id}>{kat.nama_kategori}</option>
          ))}
        </select>
        <button type="submit">Filter</button>
        <button type="button" onClick={() => { setSearch({ id: '', judul: '', penulis: '', penerbit: '', tahun_terbit: '', kategori_id: '' }); fetchBuku(); }}>Reset</button>
      </form>
      
      {/* Form CRUD Buku */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input name="id" placeholder="ID (Manual)" value={form.id} onChange={handleChange} required disabled={isEdit} />
        <input name="judul" placeholder="Judul" value={form.judul} onChange={handleChange} required />
        <input name="penulis" placeholder="Penulis" value={form.penulis} onChange={handleChange} required />
        <input name="penerbit" placeholder="Penerbit" value={form.penerbit} onChange={handleChange} required />
        <input name="stok" type="number" placeholder="Stok" value={form.stok} onChange={handleChange} required />
        <input name="tahun_terbit" placeholder="Tahun Terbit (Cth: 2005)" value={form.tahun_terbit} onChange={handleChange} required />
        
        <select name="kategori_id" value={form.kategori_id} onChange={handleChange} required>
          <option value="">-- Pilih Kategori --</option>
          {kategoriList.map((kat) => (
            <option key={kat.id} value={kat.id}>{kat.nama_kategori}</option>
          ))}
        </select>

        <button type="submit">{isEdit ? 'Update Buku' : 'Tambah Buku'}</button>
        {isEdit && <button type="button" onClick={() => setIsEdit(false)}>Batal</button>}
      </form>

      {/* Tabel Buku */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#ddd' }}>
            <th>ID</th>
            <th>Judul</th>
            <th>Penulis</th>
            <th>Penerbit</th>
            <th>Tanggal Terbit (dd-mm-yyyy)</th>
            <th>Stok</th>
            <th>Kategori</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {buku.length > 0 ? buku.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.judul}</td>
              <td>{item.penulis}</td>
              <td>{item.penerbit}</td>
              <td>{formatDateToDDMMYYYY(item.tahun_terbit)}</td>
              <td>{item.stok}</td>
              <td>{getNamaKategori(item.kategori_id)}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ marginLeft: '5px', color: 'red' }}>Hapus</button>
              </td>
            </tr>
          )) : <tr><td colSpan="8" style={{ textAlign: 'center' }}>Tidak ada data buku</td></tr>}
        </tbody>
      </table>
    </div>
  );
}