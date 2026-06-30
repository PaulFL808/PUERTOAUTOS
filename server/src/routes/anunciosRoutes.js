const express = require('express');
const router = express.Router();
const anunciosController = require('../controllers/anunciosController');
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', anunciosController.getAllAnuncios);
router.get('/:id', anunciosController.getAnuncioById);

router.post('/', auth, upload.array('fotos', 5), anunciosController.createAnuncio);
router.put('/:id', auth, upload.array('fotos', 5), anunciosController.updateAnuncio);
router.patch('/:id/vendido', auth, anunciosController.markAsSold);
router.delete('/:id', auth, anunciosController.deleteAnuncio);

module.exports = router;
