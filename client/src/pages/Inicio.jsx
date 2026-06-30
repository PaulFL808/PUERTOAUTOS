import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../services/api';

const MARCAS = ['Toyota', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Suzuki'];

const Inicio = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [filtros, setFiltros] = useState({
    marca: '',
    precioMax: ''
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
      if (filtros.precioMax) query += `precioMax=${filtros.precioMax}`;
      
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
        <form onSubmit={handleFilter} className="search-form">
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
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
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label">Precio Máximo</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="Ej: 15000000" 
              value={filtros.precioMax}
              onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '45px' }}>
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
                  <span>{anuncio.año}</span>
                  <span>{anuncio.kilometraje} km</span>
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
