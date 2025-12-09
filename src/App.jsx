import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [siswaList, setSiswaList] = useState([]);
  
  // Update State Form dengan jenis_kelamin
  const [formData, setFormData] = useState({
    kode_siswa: '', 
    nama_siswa: '', 
    jenis_kelamin: '', // Field Baru
    alamat_siswa: '', 
    tgl_siswa: '', 
    jurusan_siswa: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', msg: '' });

  useEffect(() => { fetchSiswa(); }, []);

  useEffect(() => {
    if (!isEditing) { generateAutoCode(siswaList); }
  }, [siswaList, isEditing]);

  const fetchSiswa = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/siswa');
      setSiswaList(response.data);
    } catch (error) { console.error("Gagal ambil data:", error); }
  };

  const generateAutoCode = (data) => {
    if (data.length === 0) {
      setFormData(prev => ({ ...prev, kode_siswa: 'S-001' }));
    } else {
      const maxId = data.reduce((max, siswa) => {
        const numberPart = parseInt(siswa.kode_siswa.replace('S-', ''));
        return numberPart > max ? numberPart : max;
      }, 0);
      const nextId = maxId + 1;
      const nextCode = `S-${String(nextId).padStart(3, '0')}`;
      setFormData(prev => ({ ...prev, kode_siswa: nextCode }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo({ show: false, type: '', msg: '' });

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/siswa/${editId}`, formData);
        showAlert('success', 'Data berhasil diperbarui!');
      } else {
        await axios.post('http://localhost:5000/api/siswa', formData);
        showAlert('success', 'Siswa berhasil ditambahkan!');
      }
      resetForm();
      fetchSiswa();
    } catch (error) {
      const pesanError = error.response?.data?.error || "Terjadi kesalahan sistem";
      showAlert('danger', pesanError);
    }
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
    setFormData({ 
        kode_siswa: siswa.kode_siswa, 
        nama_siswa: siswa.nama_siswa, 
        jenis_kelamin: siswa.jenis_kelamin, // Load data gender
        alamat_siswa: siswa.alamat_siswa, 
        tgl_siswa: tgl, 
        jurusan_siswa: siswa.jurusan_siswa 
    });
    setIsEditing(true);
    setEditId(siswa.id);
  };

  const resetForm = () => {
    setFormData({ kode_siswa: '', nama_siswa: '', jenis_kelamin: '', alamat_siswa: '', tgl_siswa: '', jurusan_siswa: '' });
    setIsEditing(false);
    setEditId(null);
    setTimeout(() => generateAutoCode(siswaList), 100);
  };

  const showAlert = (type, msg) => {
    setAlertInfo({ show: true, type, msg });
    setTimeout(() => setAlertInfo({ show: false, type: '', msg: '' }), 4000); 
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow mb-4">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#"><i className="bi bi-mortarboard-fill me-2"></i>Sekolah App</a>
          <span className="navbar-text text-white small">Uji Kompetensi Keahlian</span>
        </div>
      </nav>

      <div className="container">
        {alertInfo.show && (
            <div className={`alert alert-${alertInfo.type} alert-dismissible fade show shadow-sm`} role="alert">
                <i className={`bi ${alertInfo.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                <strong>{alertInfo.msg}</strong>
                <button type="button" className="btn-close" onClick={() => setAlertInfo({...alertInfo, show: false})}></button>
            </div>
        )}

        <div className="row">
          {/* FORM INPUT (KIRI) */}
          <div className="col-md-4 mb-4">
            <div className="card shadow border-0 rounded-3">
              <div className="card-header bg-white pt-4 border-bottom-0">
                <h5 className="fw-bold text-primary">
                  {isEditing ? <><i className="bi bi-pencil-square me-2"></i>Edit Siswa</> : <><i className="bi bi-person-plus-fill me-2"></i>Tambah Siswa</>}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Kode Siswa</label>
                    <input type="text" className="form-control fw-bold" name="kode_siswa" value={formData.kode_siswa} readOnly style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Nama Lengkap</label>
                    <input type="text" className="form-control" name="nama_siswa" value={formData.nama_siswa} onChange={handleChange} placeholder="Nama..." required />
                  </div>

                  {/* INPUT JENIS KELAMIN */}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Jenis Kelamin</label>
                    <select className="form-select" name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} required>
                      <option value="">-- Pilih --</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Alamat</label>
                    <textarea className="form-control" name="alamat_siswa" rows="2" value={formData.alamat_siswa} onChange={handleChange} placeholder="Alamat..." required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Tanggal Lahir</label>
                    <input type="date" className="form-control" name="tgl_siswa" value={formData.tgl_siswa} onChange={handleChange} required />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Jurusan</label>
                    <select className="form-select" name="jurusan_siswa" value={formData.jurusan_siswa} onChange={handleChange} required>
                      <option value="">-- Pilih Jurusan --</option>
                      <option value="RPL">Rekayasa Perangkat Lunak</option>
                      <option value="TKJ">Teknik Komputer Jaringan</option>
                      <option value="MM">Multimedia</option>
                    </select>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <button type="submit" className={`btn ${isEditing ? 'btn-warning text-white' : 'btn-primary'} fw-bold`}>
                      {isEditing ? 'Update Data' : 'Simpan Data'}
                    </button>
                    {isEditing && (
                      <button type="button" className="btn btn-outline-danger" onClick={resetForm}>Batal</button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* TABEL DATA (KANAN) */}
          <div className="col-md-8">
            <div className="card shadow border-0 rounded-3">
              <div className="card-header bg-white pt-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0"><i className="bi bi-list-ul me-2"></i>Data Siswa</h5>
                <span className="badge bg-primary rounded-pill">{siswaList.length} Siswa</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light text-secondary">
                      <tr>
                        <th className="ps-4">Kode</th>
                        <th>Nama</th>
                        <th>Jenis Kelamin</th>
                        <th>Tanggal Lahir</th>
                        <th>Jurusan</th>
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {siswaList.length === 0 ? (
                        <tr><td colSpan="6" className="text-center py-5 text-muted">Belum ada data siswa.</td></tr>
                      ) : (
                        siswaList.map((s) => (
                          <tr key={s.id}>
                            <td className="ps-4 fw-bold text-primary">{s.kode_siswa}</td>
                            <td>
                              <div className="fw-bold text-dark">{s.nama_siswa}</div>
                              <small className="text-muted text-truncate d-block" style={{maxWidth: '150px'}}>{s.alamat_siswa}</small>
                            </td>
                            {/* TAMPILKAN JENIS KELAMIN */}
                            <td>
                                <span className={`badge ${s.jenis_kelamin === 'Laki-laki' ? 'bg-primary' : 'bg-danger'} bg-opacity-75`}>
                                    {s.jenis_kelamin === 'Laki-laki' ? 'L' : 'P'}
                                </span>
                            </td>
                            <td>{s.tgl_siswa ? new Date(s.tgl_siswa).toLocaleDateString('id-ID') : '-'}</td>
                            <td><span className="badge bg-info text-dark">{s.jurusan_siswa}</span></td>
                            <td className="text-center">
                              <button className="btn btn-sm btn-light text-warning me-1 border" onClick={() => handleEdit(s)}>
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button className="btn btn-sm btn-light text-danger border" onClick={() => handleDelete(s.id)}>
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
      <footer className="text-center text-muted py-4 mt-5 small">&copy; 2025 Aplikasi Sekolah</footer>
    </div>
  );
}

export default App;