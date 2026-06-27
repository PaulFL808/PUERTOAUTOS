import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Save } from 'lucide-react';
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

const EditarAnuncio = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnuncio();
  }, [id]);

  const fetchAnuncio = async () => {
    try {
      const { data } = await api.get(`/anuncios/${id}`);
      // Solo el dueño puede editar
      if (user && data.usuario_id !== user.id) {
        alert('No tienes permiso para editar este anuncio');
        navigate('/mis-anuncios');
        return;
      }

      setFormData({
        marca: data.marca,
        modelo: data.modelo,
        anio: data.año, // mapeo de la DB (año) al estado local (anio)
        precio: data.precio,
        kilometraje: data.kilometraje,
        descripcion: data.descripcion || ''
      });

      // Configurar comboboxes
      if (Object.keys(MARCAS_MODELOS).includes(data.marca)) {
        setMarcaSelect(data.marca);
        if (MARCAS_MODELOS[data.marca].includes(data.modelo)) {
          setModeloSelect(data.modelo);
        } else {
          setModeloSelect('Otro');
        }
      } else {
        setMarcaSelect('Otro');
        setModeloSelect('Otro');
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('Error al cargar el anuncio');
      navigate('/mis-anuncios');
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.put(`/anuncios/${id}`, formData);
      navigate('/mis-anuncios');
    } catch (error) {
      console.error('Error editando anuncio', error);
      alert('Hubo un error al editar el anuncio.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex-center mt-4"><h2 className="title">Cargando...</h2></div>;

  return (
    <div className="flex-center">
      <div className="glass-panel p-6" style={{ width: '100%', maxWidth: '600px' }}>
        <h2 className="title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Editar Anuncio</h2>
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

          {/* En una edición de MVP simplificada, usualmente no se cambian las fotos, o se requiere un sistema más complejo de eliminar/añadir. Lo dejaremos sin edición de fotos por ahora. */}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '12px' }} disabled={saving}>
            {saving ? 'Guardando...' : <><Save size={18} /> Guardar Cambios</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarAnuncio;
