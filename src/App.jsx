import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [siswaList, setSiswaList] = useState([]);
  const [formData, setFormData] = useState({
    kode_siswa: '', nama_siswa: '', alamat_siswa: '', tgl_siswa: '', jurusan_siswa: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchSiswa(); }, []);

  const fetchSiswa = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/siswa');
      setSiswaList(response.data);
    } catch (error) { console.error("Gagal ambil data:", error); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/siswa/${editId}`, formData);
        alert("Berhasil Update!");
      } else {
        await axios.post('http://localhost:5000/api/siswa', formData);
        alert("Berhasil Simpan!");
      }
      resetForm();
      fetchSiswa();
    } catch (error) { console.error("Error submit:", error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus data ini?")) {
      try {
        await axios.delete(`http://localhost:5000/api/siswa/${id}`);
        fetchSiswa();
      } catch (error) { console.error("Gagal hapus:", error); }
    }
  };

  const handleEdit = (siswa) => {
    const tgl = siswa.tgl_siswa ? new Date(siswa.tgl_siswa).toISOString().split('T')[0] : '';
    setFormData({ ...siswa, tgl_siswa: tgl });
    setIsEditing(true);
    setEditId(siswa.id);
  };

  const resetForm = () => {
    setFormData({ kode_siswa: '', nama_siswa: '', alamat_siswa: '', tgl_siswa: '', jurusan_siswa: '' });
    setIsEditing(false);
    setEditId(null);
  }

  return (
    <div className="app-container">
      {/* 1. NAVBAR DI ATAS */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-mortarboard-fill me-2"></i>
            Sekolah App
          </a>
          <span className="navbar-text text-white">
            Uji Kompetensi Keahlian
          </span>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          
          {/* 2. KOLOM FORM (KIRI) */}
          <div className="col-md-4 mb-4">
            <div className="card shadow border-0 rounded-3">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
                <h5 className="fw-bold text-primary">
                  {isEditing ? <><i className="bi bi-pencil-square me-2"></i>Edit Siswa</> : <><i className="bi bi-person-plus-fill me-2"></i>Tambah Siswa</>}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Kode Siswa</label>
                    <input type="text" className="form-control" name="kode_siswa" value={formData.kode_siswa} onChange={handleChange} placeholder="Cth: S-001" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Nama Lengkap</label>
                    <input type="text" className="form-control" name="nama_siswa" value={formData.nama_siswa} onChange={handleChange} placeholder="Nama Siswa" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Alamat</label>
                    <textarea className="form-control" name="alamat_siswa" rows="2" value={formData.alamat_siswa} onChange={handleChange} placeholder="Alamat lengkap" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-muted">Tanggal Lahir</label>
                    <input type="date" className="form-control" name="tgl_siswa" value={formData.tgl_siswa} onChange={handleChange} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small text-muted">Jurusan</label>
                    <select className="form-select" name="jurusan_siswa" value={formData.jurusan_siswa} onChange={handleChange} required>
                      <option value="">-- Pilih Jurusan --</option>
                      <option value="RPL">Rekayasa Perangkat Lunak</option>
                      <option value="TKJ">Teknik Komputer Jaringan</option>
                      <option value="MM">Multimedia</option>
                    </select>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button type="submit" className={`btn ${isEditing ? 'btn-warning text-white' : 'btn-primary'}`}>
                      {isEditing ? <><i className="bi bi-save me-2"></i>Update Data</> : <><i className="bi bi-plus-circle me-2"></i>Simpan Data</>}
                    </button>
                    {isEditing && (
                      <button type="button" className="btn btn-light text-danger" onClick={resetForm}>
                        <i className="bi bi-x-circle me-2"></i>Batal
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* 3. KOLOM TABEL (KANAN) */}
          <div className="col-md-8">
            <div className="card shadow border-0 rounded-3">
              <div className="card-header bg-white border-bottom-0 pt-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0"><i className="bi bi-list-ul me-2"></i>Data Siswa</h5>
                <span className="badge bg-primary rounded-pill">{siswaList.length} Siswa</span>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Jurusan</th>
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siswaList.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-muted">Belum ada data siswa.</td>
                        </tr>
                      ) : (
                        siswaList.map((s) => (
                          <tr key={s.id}>
                            <td className="fw-bold text-primary">{s.kode_siswa}</td>
                            <td>
                              <div className="fw-bold">{s.nama_siswa}</div>
                              <small className="text-muted">{s.alamat_siswa}</small>
                            </td>
                            <td><span className="badge bg-info text-dark">{s.jurusan_siswa}</span></td>
                            <td className="text-center">
                              <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(s)} title="Edit">
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)} title="Hapus">
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <footer className="text-center text-muted py-4 mt-5">
        <small>© 2025 Uji Kompetensi BBPVP Bekasi</small>
      </footer>
    </div>
  );
}

export default App;