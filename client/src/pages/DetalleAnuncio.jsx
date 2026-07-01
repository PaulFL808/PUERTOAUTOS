import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Mail, Calendar, Gauge, Tag, X, Trash2 } from 'lucide-react';

const DetalleAnuncio = () => {
  const { id } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // Estado para el lightbox
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAnuncio();
  }, [id]);

  const handleEliminarAdmin = async () => {
    if (window.confirm('Como administrador, ¿seguro que deseas eliminar este anuncio permanentemente?')) {
      try {
        await api.delete(`/anuncios/${id}`);
        window.location.href = '/';
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  const fetchAnuncio = async () => {
    try {
      const { data } = await api.get(`/anuncios/${id}`);
      setAnuncio(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  if (loading) return <div className="flex-center mt-4"><h2 className="title">Cargando...</h2></div>;
  if (!anuncio) return <div className="flex-center mt-4"><h2 className="title">Anuncio no encontrado</h2></div>;

  return (
    <div>
      <Link to="/" className="btn btn-outline mb-4">← Volver al listado</Link>
      
      <div className="glass-panel p-6 detalle-grid">
        {/* Left Column: Photos */}
        <div>
          {anuncio.fotos && anuncio.fotos.length > 0 ? (
            <img 
              src={`https://api-production-710a.up.railway.app${anuncio.fotos[0].url}`} 
              alt={`${anuncio.marca} ${anuncio.modelo}`} 
              style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', height: '400px', cursor: 'pointer' }}
              onClick={() => setSelectedImage(`https://api-production-710a.up.railway.app${anuncio.fotos[0].url}`)}
            />
          ) : (
            <div className="img-placeholder" style={{ borderRadius: 'var(--radius-lg)', height: '400px' }}>
              Sin imágenes disponibles
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }}>
            {anuncio.fotos && anuncio.fotos.slice(1).map(foto => (
              <img 
                key={foto.id} 
                src={`https://api-production-710a.up.railway.app${foto.url}`} 
                alt="" 
                style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                onClick={() => setSelectedImage(`https://api-production-710a.up.railway.app${foto.url}`)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Details */}
        <div>
          <div className="mb-4">
            <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '4px' }}>
              {anuncio.marca} {anuncio.modelo}
            </h1>
            {anuncio.ciudad && anuncio.region && (
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '8px' }}>
                📍 {anuncio.ciudad}, {anuncio.region}
              </p>
            )}
            <p className="text-gradient" style={{ fontSize: '2rem', fontWeight: 700 }}>
              {formatPrice(anuncio.precio)}
            </p>
          </div>
          
          <div className="glass-card p-6 mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex-between">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Calendar size={18} /> Año
              </span>
              <strong style={{ fontSize: '1.1rem' }}>{anuncio.año}</strong>
            </div>
            <div className="flex-between">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Gauge size={18} /> Kilometraje
              </span>
              <strong style={{ fontSize: '1.1rem' }}>{new Intl.NumberFormat('es-CL').format(anuncio.kilometraje)} km</strong>
            </div>
            <div className="flex-between">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <Tag size={18} /> Estado
              </span>
              {anuncio.estado === 'Vendido' ? (
                <span className="tag tag-sold" style={{ fontSize: '1rem' }}>Vendido</span>
              ) : anuncio.estado === 'Pendiente' ? (
                <span className="tag" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', fontSize: '1rem' }}>Pendiente</span>
              ) : (
                <span className="tag tag-active" style={{ fontSize: '1rem' }}>Activo</span>
              )}
            </div>
          </div>

          {anuncio.descripcion && (
            <div className="glass-card p-6 mb-4">
              <h3 style={{ marginBottom: '12px', fontSize: '1.2rem' }}>Descripción</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {anuncio.descripcion}
              </p>
            </div>
          )}

          <div className="glass-card p-6">
            <h3 style={{ marginBottom: '12px', fontSize: '1.2rem' }}>Información del Vendedor</h3>
            <p style={{ fontWeight: 500, fontSize: '1.1rem', marginBottom: '4px' }}>{anuncio.dueño?.nombre}</p>
            {user ? (
              <a href={`mailto:${anuncio.dueño?.email}`} className="btn btn-primary mt-4" style={{ width: '100%' }}>
                <Mail size={18} /> Contactar al Vendedor
              </a>
            ) : (
              <div className="mt-4" style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Debes iniciar sesión para contactar</p>
                <Link to="/login" className="btn btn-outline" style={{ width: '100%' }}>Iniciar Sesión</Link>
              </div>
            )}
            
            {user && user.rol === 'admin' && (
              <div className="mt-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button onClick={handleEliminarAdmin} className="btn btn-danger" style={{ width: '100%' }}>
                  <Trash2 size={18} /> Eliminar Anuncio (Acción de Admin)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Modal de Imagen a Pantalla Completa */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '10px'
            }}
          >
            <X size={36} />
          </button>
          
          <img 
            src={selectedImage} 
            alt="Fullscreen" 
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
            onClick={(e) => e.stopPropagation()} /* Evita cerrar si hace clic en la foto */
          />
        </div>
      )}
    </div>
  );
};

export default DetalleAnuncio;
