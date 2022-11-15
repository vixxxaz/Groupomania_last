// import de express
const express = require('express');

//import de body parser
const bodyParser = require('body-parser');

//importe variable environement
const dotenv = require('dotenv');

//charger la config dotenv
dotenv.config()

//import du router des post
const routePost = require('./routes/post_route');

//import du router user
const userRoutes = require('./routes/user_route');

/** on importe le module "express-mongo-sanitize" pour prévenir des
 attaques par injection de code dans les "form"*/
const mongoSanitize = require('express-mongo-sanitize');

//package pour cross origine request
const cors = require('cors');

//import de mongoose
const mongoose = require('mongoose');

//crée une app express
const app = express();

// installation du module "helmet" qui prévient des failles de sécurité courante liées au "headers"
const helmet = require("helmet");

//on importe un module contre attaque de type "brute-force" et "dictionary"
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requêtes par IP durant 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
});



//cors error
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
    allowedHeaders: ['sessionId', 'Content-Type', 'Authorization'],
    exposedHeaders: ['sessionId'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  }

  //accés à mongoose
  mongoose.connect(`mongodb+srv://${process.env.BD_USERNAME}:${process.env.BD_PASS}@mycluster.02ixjjw.mongodb.net/reseau7`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('connexion à mongooDB réussie !'))
    .catch(() => console.log('connexion à mongoDB échouée !'));


  
//acceder au corp de la requete
app.use(bodyParser.json());

//cross origine
app.use(cors(corsOptions));

//limit les tentative de connexion abusive pour un piratage 
app.use(apiLimiter);

// on désactive le header "X-Powered-By" qui pourrait constituer une fuite d'informations
app.use(helmet.hidePoweredBy());

// configuration "Cross-Origin-Resource-Policy: same-site"
app.use(helmet.crossOriginResourcePolicy({ policy: "same-site" }));

//configuration "express-mongo-sanitze" allowDots et replaceWith en globale
app.use(
  mongoSanitize({
      allowDots: true,
      replaceWith: "_",
  })
);


//enregistrer les routes des post
app.use('/api/post', routePost);

//enregistrer les routes utilisateur
app.use('/api/auth', userRoutes);

//route pour l ajout d image
app.use("/images", express.static("images"));

//exporte application pour y acceder depuis d'autre fichier comme le server node
module.exports = app;