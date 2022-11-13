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
    // si le type de variable file dans la requete est undefined
    if (typeof req.file == 'undefined') {      
        //Declare le niveau de cryptage
        bcrypt.hash(Data.password, 10)
            .then(hash => {
                //creer un nouvel utilisateur avec l'image par default
                var user = new User({
                    email: Data.email,
                    password: hash,
                    name: Data.nom,
                    picture: "http://localhost:3000/images/image.png",
                });
                //le sauver dans la satabase
                user.save()
                    .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    } else { 
        //il y a une image "pour pouvoir ajouter l option"
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
    //recupere la requete
    const Data = JSON.parse(req.body.data);

    //trouver l utilisateur avec le mail dans la base de données
    User.findOne({ email: Data.email })
        .then(user => {
            if (!user) {//Si le username est incorrect
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(Data.password, user.password)//Compare le password crypter
                .then(valid => {
                    //si le mot de passe ne correspond pas
                    if (!valid) {
                        //Si incorrect
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }//sinon envois la reponse et le token 
                    res.status(200).json({
                        userId: user._id,
                        admin: user.admin,
                        token: jwt.sign(
                            { userId: user._id },
                            `${process.env.KEY_TOKEN}`,
                            { expiresIn: '24h' }
                        )
                        
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//recuperer un user
exports.oneUser = (req, res, next) => {
    //trouver l user en comparant l id de la base de données
    User.findOne({ _id: req.auth.userId })
        //envois le nom est l'image dans la reponse
        .then(user => {
            res.status(200).json({
                userId: user._id,
                name: user.name,
                picture: user.picture
            })
        })
        .catch(error => res.status(501).json({ error }));
} 

