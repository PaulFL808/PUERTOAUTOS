const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado, no hay token.' });
  }

  try {
    const cleanToken = token.replace('Bearer ', '');
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.usuario = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};
