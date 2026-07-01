import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CarFront, LogOut, PlusCircle, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{ padding: '16px 0', borderRadius: '0', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      <div className="container flex-between">
        <Link to="/" className="flex-center" style={{ gap: '10px' }}>
          <CarFront size={32} className="text-gradient" />
          <h1 className="title navbar-title" style={{ marginBottom: 0 }}>
            PUERTOAUTOS
          </h1>
        </Link>
        
        <div className="flex-center navbar-actions">
          {user ? (
            <>
              <Link to="/mis-anuncios" className="form-label" style={{ color: 'var(--text-main)' }}>
                Mis Anuncios
              </Link>
              {user.rol === 'admin' ? (
                <Link to="/admin" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #ef4444, #f59e0b)' }}>
                  Panel Admin
                </Link>
              ) : (
                <Link to="/publicar" className="btn btn-primary">
                  <PlusCircle size={18} /> Publicar
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px', border: 'none' }}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                <User size={18} /> Iniciar Sesión
              </Link>
              <Link to="/registro" className="btn btn-primary">
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
