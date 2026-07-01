import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Check, X } from 'lucide-react';

const AdminPanel = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.rol !== 'admin') {
      navigate('/');
      return;
    }
    fetchPendientes();
  }, [user, authLoading]);

  const fetchPendientes = async () => {
    try {
      const { data } = await api.get('/anuncios/admin/pendientes');
      setAnuncios(data);
    } catch (error) {
      console.error('Error cargando anuncios pendientes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstado = async (id, estado) => {
    try {
      await api.patch(`/anuncios/admin/${id}/estado`, { estado });
      fetchPendientes();
    } catch (error) {
      alert(`Error al intentar cambiar a ${estado}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  if (loading) return <div className="flex-center mt-4"><h2 className="title">Cargando Panel...</h2></div>;

  return (
    <div>
      <h2 className="title mb-4">Panel de Administración</h2>
      
      {anuncios.length === 0 ? (
        <div className="glass-panel p-6" style={{ textAlign: 'center' }}>
          <p className="subtitle" style={{ marginBottom: '16px' }}>No hay anuncios pendientes de revisión.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {anuncios.map(anuncio => (
            <div key={anuncio.id} className="glass-panel p-6 anuncio-card">
              <div style={{ width: '150px', height: '100px', flexShrink: 0 }}>
                {anuncio.fotos && anuncio.fotos.length > 0 ? (
                  <img 
                    src={`https://api-production-710a.up.railway.app${anuncio.fotos[0].url}`} 
                    alt={`${anuncio.marca} ${anuncio.modelo}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                ) : (
                  <div className="img-placeholder" style={{ height: '100%', borderRadius: '8px', fontSize: '0.8rem' }}>Sin foto</div>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{anuncio.marca} {anuncio.modelo}</h3>
                  <span className="tag" style={{background: 'rgba(234, 179, 8, 0.15)', color: '#eab308'}}>Pendiente</span>
                </div>
                <p className="text-gradient" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatPrice(anuncio.precio)}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Vendedor: {anuncio.dueño?.nombre} ({anuncio.dueño?.email})</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Publicado: {new Date(anuncio.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => handleEstado(anuncio.id, 'Activo')} className="btn btn-success" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <Check size={16} /> Aprobar
                </button>
                <button onClick={() => handleEstado(anuncio.id, 'Rechazado')} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <X size={16} /> Rechazar y Eliminar
                </button>
                <Link to={`/anuncio/${anuncio.id}`} target="_blank" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem', textAlign: 'center' }}>
                  Ver Detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
