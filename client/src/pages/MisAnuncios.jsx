import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';

const MisAnuncios = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMisAnuncios();
  }, [user]);

  const fetchMisAnuncios = async () => {
    try {
      // Optimizacion: podriamos tener un endpoint GET /mis-anuncios, pero para MVP, filtramos
      const { data } = await api.get('/anuncios');
      const filtrados = data.filter(a => a.usuario_id === user.id);
      setAnuncios(filtrados);
    } catch (error) {
      console.error('Error cargando anuncios', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarcarVendido = async (id) => {
    if (window.confirm('¿Seguro que deseas marcar este anuncio como vendido?')) {
      try {
        await api.patch(`/anuncios/${id}/vendido`);
        fetchMisAnuncios();
      } catch (error) {
        alert('Error al actualizar');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  if (loading) return <div className="flex-center mt-4"><h2 className="title">Cargando...</h2></div>;

  return (
    <div>
      <div className="flex-between mb-4">
        <h2 className="title">Mis Anuncios</h2>
        <Link to="/publicar" className="btn btn-primary">Nuevo Anuncio</Link>
      </div>

      {anuncios.length === 0 ? (
        <div className="glass-panel p-6" style={{ textAlign: 'center' }}>
          <p className="subtitle" style={{ marginBottom: '16px' }}>No has publicado ningún anuncio todavía.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {anuncios.map(anuncio => (
            <div key={anuncio.id} className="glass-panel p-6" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ width: '150px', height: '100px', flexShrink: 0 }}>
                {anuncio.fotos && anuncio.fotos.length > 0 ? (
                  <img 
                    src={`http://localhost:3000${anuncio.fotos[0].url}`} 
                    alt="Auto" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                  />
                ) : (
                  <div className="img-placeholder" style={{ height: '100%', borderRadius: '8px', fontSize: '0.8rem' }}>Sin foto</div>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{anuncio.marca} {anuncio.modelo}</h3>
                  {anuncio.estado === 'Vendido' ? <span className="tag tag-sold">Vendido</span> : <span className="tag tag-active">Activo</span>}
                </div>
                <p className="text-gradient" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatPrice(anuncio.precio)}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{anuncio.año} • {anuncio.kilometraje} km</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {anuncio.estado === 'Activo' && (
                  <button onClick={() => handleMarcarVendido(anuncio.id)} className="btn btn-success">
                    <CheckCircle size={16} /> Marcar Vendido
                  </button>
                )}
                <Link to={`/anuncio/${anuncio.id}`} className="btn btn-outline">
                  Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisAnuncios;
