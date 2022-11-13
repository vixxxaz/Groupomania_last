//ajout d 'express
const express = require('express');

//import du router
const router = express.Router();

//connect les controller
const userCtrl = require('../controllers/user');

//gestion securité
const auth = require('../middleware/auth');

//routes avec endpoint
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/user', auth, userCtrl.oneUser);
router.get('/users', auth, userCtrl.getAllUsers)

module.exports = router;