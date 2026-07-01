import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PublicarAnuncio from './pages/PublicarAnuncio';
import EditarAnuncio from './pages/EditarAnuncio';
import DetalleAnuncio from './pages/DetalleAnuncio';
import MisAnuncios from './pages/MisAnuncios';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <>
      <Navbar />
      <main className="container my-8">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/publicar" element={<PublicarAnuncio />} />
          <Route path="/editar/:id" element={<EditarAnuncio />} />
          <Route path="/anuncio/:id" element={<DetalleAnuncio />} />
          <Route path="/mis-anuncios" element={<MisAnuncios />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
