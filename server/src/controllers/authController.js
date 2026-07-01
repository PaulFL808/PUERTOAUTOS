const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    const nuevoUsuario = await Usuario.create({ nombre, email, password });
    
    // Generar token (opcional devolverlo en registro, pero mejor para UX)
    const token = jwt.sign(
      { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: 'Usuario creado exitosamente', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    const passwordValida = await usuario.validarPassword(password);
    if (!passwordValida) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};
