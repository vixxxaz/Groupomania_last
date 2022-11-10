//importe express
const express = require('express');

//importe le fichier route
const router = express.Router();

//importe la verification de token
const auth = require('../middleware/auth');

//gestion fichier
const multer = require('../middleware/multer-config');

//connect les controller
const stuffCtrl = require('../controllers/post');


//ajout des routes avec endpoint
router.get('/', auth, stuffCtrl.getAllPost);
router.post('/', auth, multer, stuffCtrl.createPost);
router.get('/:id', auth, stuffCtrl.getOnePost);
router.put('/:id', auth, multer, stuffCtrl.modifyPost);
router.delete('/:id', auth, stuffCtrl.deletePost);
router.post('/:id/like', auth, stuffCtrl.likePost);

module.exports = router;