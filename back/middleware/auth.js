//import dotenv 
const dotenv = require('dotenv');

//charger la config dotenv
dotenv.config();


//import json Web token 
const jwt = require('jsonwebtoken');


//module qui decode verifie le token 
module.exports = (req, res, next) => {

    try {
        //recupere le token dans le header de la requete
        const token = req.headers.authorization;
        //decode le token
        const decodedToken = jwt.verify(token, `${process.env.KEY_TOKEN}`);
        //recupere le userId dans le token  
        const userId = decodedToken.userId;      
        req.auth = {
            userId: userId
        };
        next();       
    } catch (error) {
        res.status(401).json({ error });
    }
};