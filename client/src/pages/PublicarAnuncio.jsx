import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Send, ImagePlus } from 'lucide-react';
import api from '../services/api';

const PublicarAnuncio = () => {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: '',
    precio: '',
    kilometraje: ''
  });
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFotos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para publicar un anuncio.');
      return;
    }
    
    setLoading(true);
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      for (let i = 0; i < fotos.length; i++) {
        data.append('fotos', fotos[i]);
      }

      await api.post('/anuncios', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/mis-anuncios');
    } catch (error) {
      console.error('Error publicando anuncio', error);
      alert('Hubo un error al publicar el anuncio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center">
      <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Publicar Vehículo</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid-cards" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Marca</label>
              <input type="text" name="marca" className="form-control" required value={formData.marca} onChange={handleInputChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Modelo</label>
              <input type="text" name="modelo" className="form-control" required value={formData.modelo} onChange={handleInputChange} />
            </div>
          </div>
          
          <div className="grid-cards" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Año</label>
              <input type="number" name="año" className="form-control" required min="1900" max="2025" value={formData.año} onChange={handleInputChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Precio ($)</label>
              <input type="number" name="precio" className="form-control" required min="0" value={formData.precio} onChange={handleInputChange} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Kilometraje</label>
              <input type="number" name="kilometraje" className="form-control" required min="0" value={formData.kilometraje} onChange={handleInputChange} />
            </div>
          </div>

          <div className="form-group mt-4">
            <label className="form-label">Fotos (Máx 5)</label>
            <div className="glass-card flex-center" style={{ borderStyle: 'dashed', height: '120px', cursor: 'pointer', position: 'relative' }}>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange}
                style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
              <div className="flex-center" style={{ flexDirection: 'column', color: 'var(--text-muted)' }}>
                <ImagePlus size={32} style={{ marginBottom: '8px' }} />
                <span>{fotos.length > 0 ? `${fotos.length} fotos seleccionadas` : 'Arrastra o haz clic para subir fotos'}</span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '12px' }} disabled={loading}>
            {loading ? 'Publicando...' : <><Send size={18} /> Publicar Anuncio</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicarAnuncio;
