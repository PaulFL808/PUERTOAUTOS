import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Send, ImagePlus } from 'lucide-react';
import api from '../services/api';

const MARCAS_MODELOS = {
  Toyota: ['Yaris', 'Corolla', 'Hilux', 'RAV4', 'Otro'],
  Chevrolet: ['Sail', 'Spark', 'Tracker', 'Silverado', 'Otro'],
  Nissan: ['Versa', 'Sentra', 'Kicks', 'Navara', 'Otro'],
  Hyundai: ['Accent', 'Tucson', 'Santa Fe', 'Elantra', 'Otro'],
  Kia: ['Morning', 'Rio', 'Sportage', 'Sorento', 'Otro'],
  Suzuki: ['Swift', 'Baleno', 'Vitara', 'Jimny', 'Otro'],
  Otro: ['Otro']
};

const PublicarAnuncio = () => {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    anio: '',
    precio: '',
    kilometraje: '',
    descripcion: ''
  });
  const [marcaSelect, setMarcaSelect] = useState('');
  const [modeloSelect, setModeloSelect] = useState('');
  const [fotos, setFotos] = useState([]);
  const [fotosPreview, setFotosPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMarcaChange = (e) => {
    const value = e.target.value;
    setMarcaSelect(value);
    setModeloSelect('');
    setFormData(prev => ({ ...prev, marca: value === 'Otro' ? '' : value, modelo: '' }));
  };

  const handleModeloChange = (e) => {
    const value = e.target.value;
    setModeloSelect(value);
    setFormData(prev => ({ ...prev, modelo: value === 'Otro' ? '' : value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFotos(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setFotosPreview(previews);
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
          <div className="form-grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Marca</label>
              <select className="form-control" value={marcaSelect} onChange={handleMarcaChange} required>
                <option value="">Seleccione una marca</option>
                {Object.keys(MARCAS_MODELOS).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {marcaSelect === 'Otro' && (
                <input type="text" name="marca" className="form-control" style={{ marginTop: '8px' }} placeholder="Escriba la marca" required value={formData.marca} onChange={handleInputChange} />
              )}
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Modelo</label>
              <select className="form-control" value={modeloSelect} onChange={handleModeloChange} required disabled={!marcaSelect}>
                <option value="">Seleccione un modelo</option>
                {marcaSelect && MARCAS_MODELOS[marcaSelect] && MARCAS_MODELOS[marcaSelect].map(m => (
                   <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {modeloSelect === 'Otro' && (
                <input type="text" name="modelo" className="form-control" style={{ marginTop: '8px' }} placeholder="Escriba el modelo" required value={formData.modelo} onChange={handleInputChange} />
              )}
            </div>
          </div>
          
          <div className="form-grid-3">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Año</label>
              <input type="number" name="anio" className="form-control" required min="1900" max="2025" value={formData.anio} onChange={handleInputChange} />
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

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Descripción (Opcional, máx 1000 caracteres)</label>
            <textarea 
              name="descripcion" 
              className="form-control" 
              rows="4" 
              maxLength="1000" 
              value={formData.descripcion} 
              onChange={handleInputChange} 
              placeholder="Describe los detalles importantes, equipamiento o estado del auto..."
            ></textarea>
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
            
            {fotosPreview.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', overflowX: 'auto' }}>
                {fotosPreview.map((src, index) => (
                  <img key={index} src={src} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                ))}
              </div>
            )}
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
