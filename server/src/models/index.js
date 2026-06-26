const Usuario = require('./Usuario');
const Anuncio = require('./Anuncio');
const Foto = require('./Foto');

// Asociaciones
Usuario.hasMany(Anuncio, { foreignKey: 'usuario_id', as: 'anuncios' });
Anuncio.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'dueño' });

Anuncio.hasMany(Foto, { foreignKey: 'anuncio_id', as: 'fotos', onDelete: 'CASCADE' });
Foto.belongsTo(Anuncio, { foreignKey: 'anuncio_id', as: 'anuncio' });

module.exports = {
  Usuario,
  Anuncio,
  Foto,
};
