//importer le model user
const User = require('../models/User');
//importer le package de decryptage
const bcrypt = require('bcrypt');
//importer le gestionnaire de token
const jwt = require('jsonwebtoken');
//gestion des fichier
const fs = require('fs');

//creation nouvelle utilisateur
exports.signup = (req, res, next) => {
    //recuperer les données de la requete
    const Data = req.body.data;
    console.log('ok');
    if (typeof req.file == 'undefined') {
        console.log('ok');
        console.log(Data.email);
        
        //crypte le mot de passe
        bcrypt.hash(Data.password, 10)
            .then(hash => {
                var user = new User({
                    email: Data.email,
                    password: hash,
                    name: Data.nom,
                    picture: "http://localhost:3000/images/image.png",
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else { 
        bcrypt.hash(Data.password, 10)
            .then(hash => {
                var user = new User({
                    email: Data.email,
                    password: hash,
                    name: Data.nom,
                    picture: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }

}




//fonction login
exports.login = (req, res, next) => {
    const Data = JSON.parse(req.body.data);

    User.findOne({ email: Data.email })
        .then(user => {
            if (!user) {//Si le username est incorrect
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(Data.password, user.password)//Compare le password crypter
                .then(valid => {

                    if (!valid) {
                        //Si incorrect
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        admin: user.admin,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '200h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//recuperer un user
exports.oneUser = (req, res, next) => {
    //trouver l user en comparant l id
    User.findOne({ _id: req.auth.userId })
        .then(user => {
            res.status(200).json({
                userId: user._id,
                name: user.name,
                picture: user.picture

            })
        })
        .catch(error => res.status(501).json({ error }));
} 

