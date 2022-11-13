//importe express
const express = require('express');

//importe le fichier route
const router = express.Router();

//importe la verification de token
const auth = require('../middleware/auth');

//gestion fichier
const multer = require('../middleware/multer-config');

//connect les controller
const postCtrl = require('../controllers/post');


//ajout des routes avec endpoint
router.get('/', auth, postCtrl.getAllPost);
router.post('/', auth, multer, postCtrl.createPost);
router.get('/:id', auth, postCtrl.getOnePost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.post('/:id/like', auth, postCtrl.likePost);

module.exports = router;