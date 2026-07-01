import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../services/api';

const MARCAS = ['Toyota', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Suzuki'];

const REGIONES_CIUDADES = {
  'Metropolitana': ['Santiago', 'Puente Alto', 'Maipú', 'San Bernardo', 'Providencia', 'Las Condes'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio'],
  'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chillán'],
  'Araucanía': ['Temuco', 'Villarrica', 'Pucón'],
  'Los Lagos': ['Puerto Montt', 'Osorno', 'Castro'],
  'Antofagasta': ['Antofagasta', 'Calama', 'Tocopilla'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle']
};

const Inicio = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [filtros, setFiltros] = useState({
    marca: '',
    precioMax: '',
    region: '',
    ciudad: '',
    kilometrajeMax: ''
  });

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const fetchAnuncios = async () => {
    try {
      const { data } = await api.get('/anuncios');
      setAnuncios(data);
    } catch (error) {
      console.error('Error cargando anuncios', error);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      let query = '?';
      if (filtros.marca) query += `marca=${filtros.marca}&`;
      if (filtros.precioMax) query += `precioMax=${filtros.precioMax}&`;
      if (filtros.region) query += `region=${filtros.region}&`;
      if (filtros.ciudad) query += `ciudad=${filtros.ciudad}&`;
      if (filtros.kilometrajeMax) query += `kilometrajeMax=${filtros.kilometrajeMax}&`;
      
      const { data } = await api.get(`/anuncios${query}`);
      setAnuncios(data);
    } catch (error) {
      console.error('Error filtrando', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  return (
    <div>
      <div className="flex-between mb-4">
        <div>
          <h2 className="title">Descubre tu próximo auto</h2>
          <p className="subtitle">Explora los mejores vehículos usados y nuevos.</p>
        </div>
      </div>

      <div className="glass-panel p-6 mb-4">
        <form onSubmit={handleFilter} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
              <label className="form-label">Marca</label>
              <select 
                className="form-control" 
                value={filtros.marca}
                onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}
              >
                <option value="">Todas las marcas</option>
                {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
              <label className="form-label">Precio Máximo</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="Ej: 15000000" 
                value={filtros.precioMax}
                onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
              <label className="form-label">Región</label>
              <select className="form-control" value={filtros.region} onChange={(e) => setFiltros({ ...filtros, region: e.target.value, ciudad: '' })}>
                <option value="">Todas las regiones</option>
                {Object.keys(REGIONES_CIUDADES).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
              <label className="form-label">Ciudad</label>
              <select className="form-control" value={filtros.ciudad} onChange={(e) => setFiltros({ ...filtros, ciudad: e.target.value })} disabled={!filtros.region}>
                <option value="">Todas las ciudades</option>
                {filtros.region && REGIONES_CIUDADES[filtros.region] && REGIONES_CIUDADES[filtros.region].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
              <label className="form-label">Kilometraje Máx.</label>
              <input type="number" className="form-control" placeholder="Ej: 80000" value={filtros.kilometrajeMax} onChange={(e) => setFiltros({ ...filtros, kilometrajeMax: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ height: '45px', alignSelf: 'flex-end', width: '200px' }}>
            <Search size={18} /> Buscar
          </button>
        </form>
      </div>

      <div className="grid-cards mt-4">
        {anuncios.map(anuncio => (
          <Link to={`/anuncio/${anuncio.id}`} key={anuncio.id}>
            <div className="glass-card">
              {anuncio.fotos && anuncio.fotos.length > 0 ? (
                <img 
                  src={`https://api-production-710a.up.railway.app${anuncio.fotos[0].url}`} 
                  alt={`${anuncio.marca} ${anuncio.modelo}`} 
                  style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div className="img-placeholder" style={{ height: '240px' }}>
                  Sin imagen
                </div>
              )}
              <div className="p-6">
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                    {anuncio.marca} {anuncio.modelo}
                  </h3>
                  {anuncio.estado === 'Vendido' && (
                    <span className="tag tag-sold">Vendido</span>
                  )}
                  {anuncio.estado === 'Activo' && (
                    <span className="tag tag-active">Activo</span>
                  )}
                </div>
                <p className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
                  {formatPrice(anuncio.precio)}
                </p>
                <div className="flex-between" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span>{anuncio.año} • {anuncio.kilometraje} km</span>
                  {anuncio.ciudad && anuncio.region ? (
                    <span style={{ fontSize: '0.85rem' }}>📍 {anuncio.ciudad}</span>
                  ) : (
                    <span></span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
        {anuncios.length === 0 && (
          <div className="glass-panel p-6" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <p className="subtitle">No se encontraron anuncios con esos criterios.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inicio;
