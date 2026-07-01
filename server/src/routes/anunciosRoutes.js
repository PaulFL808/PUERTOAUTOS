const express = require('express');
const router = express.Router();
const anunciosController = require('../controllers/anunciosController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const upload = require('../middlewares/upload');

router.get('/', anunciosController.getAllAnuncios);
router.get('/mis-anuncios', auth, anunciosController.getMisAnuncios);
router.get('/:id', anunciosController.getAnuncioById);

router.post('/', auth, upload.array('fotos', 5), anunciosController.createAnuncio);
router.put('/:id', auth, upload.array('fotos', 5), anunciosController.updateAnuncio);
router.patch('/:id/vendido', auth, anunciosController.markAsSold);
router.delete('/:id', auth, anunciosController.deleteAnuncio);

// Rutas de Administrador
router.get('/admin/pendientes', auth, isAdmin, anunciosController.getAdminPendientes);
router.patch('/admin/:id/estado', auth, isAdmin, anunciosController.updateEstadoAdmin);

module.exports = router;
