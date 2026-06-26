const { Anuncio, Foto, Usuario } = require('../models');
const { Op } = require('sequelize');

exports.getAllAnuncios = async (req, res) => {
  try {
    const { marca, modelo, precioMin, precioMax } = req.query;
    let where = {};

    if (marca) where.marca = { [Op.like]: `%${marca}%` };
    if (modelo) where.modelo = { [Op.like]: `%${modelo}%` };
    if (precioMin || precioMax) {
      where.precio = {};
      if (precioMin) where.precio[Op.gte] = precioMin;
      if (precioMax) where.precio[Op.lte] = precioMax;
    }

    const anuncios = await Anuncio.findAll({
      where,
      include: [
        { model: Foto, as: 'fotos' },
        { model: Usuario, as: 'dueño', attributes: ['id', 'nombre', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(anuncios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo anuncios' });
  }
};

exports.getAnuncioById = async (req, res) => {
  try {
    const anuncio = await Anuncio.findByPk(req.params.id, {
      include: [
        { model: Foto, as: 'fotos' },
        { model: Usuario, as: 'dueño', attributes: ['id', 'nombre', 'email'] }
      ]
    });

    if (!anuncio) {
      return res.status(404).json({ message: 'Anuncio no encontrado' });
    }

    res.json(anuncio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo anuncio' });
  }
};

exports.createAnuncio = async (req, res) => {
  try {
    const { marca, modelo, año, precio, kilometraje } = req.body;
    const usuario_id = req.usuario.id;

    const nuevoAnuncio = await Anuncio.create({
      marca,
      modelo,
      año,
      precio,
      kilometraje,
      usuario_id
    });

    if (req.files && req.files.length > 0) {
      const fotosData = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        anuncio_id: nuevoAnuncio.id
      }));
      await Foto.bulkCreate(fotosData);
    }

    const anuncioCreado = await Anuncio.findByPk(nuevoAnuncio.id, {
      include: [{ model: Foto, as: 'fotos' }]
    });

    res.status(201).json(anuncioCreado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el anuncio' });
  }
};

exports.updateAnuncio = async (req, res) => {
  try {
    const { marca, modelo, año, precio, kilometraje } = req.body;
    const anuncio = await Anuncio.findByPk(req.params.id);

    if (!anuncio) {
      return res.status(404).json({ message: 'Anuncio no encontrado' });
    }

    if (anuncio.usuario_id !== req.usuario.id) {
      return res.status(403).json({ message: 'No tienes permiso para editar este anuncio' });
    }

    await anuncio.update({ marca, modelo, año, precio, kilometraje });

    res.json({ message: 'Anuncio actualizado correctamente', anuncio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el anuncio' });
  }
};

exports.markAsSold = async (req, res) => {
  try {
    const anuncio = await Anuncio.findByPk(req.params.id);

    if (!anuncio) {
      return res.status(404).json({ message: 'Anuncio no encontrado' });
    }

    if (anuncio.usuario_id !== req.usuario.id) {
      return res.status(403).json({ message: 'No tienes permiso para modificar este anuncio' });
    }

    await anuncio.update({ estado: 'Vendido' });

    res.json({ message: 'Anuncio marcado como vendido', anuncio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
};
