// import de express
const express = require('express');

//import de body parser
const bodyParser = require('body-parser');

//package pour cross origine request
const cors = require('cors');

//import de mongoose
const mongoose = require('mongoose');

//import du router des post
const routePost = require('./routes/post_route');

//import du router user
const userRoutes = require('./routes/user');


//crée une app express
const app = express();


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
  mongoose.connect(`mongodb+srv://vixxxaz:Sourit2351@mycluster.02ixjjw.mongodb.net/reseau7`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('connexion à mongooDB réussie !'))
    .catch(() => console.log('connexion à mongoDB échouée !'));


//acceder au corp de la requete
app.use(bodyParser.json());

//cross origine
app.use(cors(corsOptions));

//enregistrer les routes des post
app.use('/api/post', routePost);

//enregistrer les routes utilisateur
app.use('/api/auth', userRoutes);

//route pour l ajout d image
app.use("/images", express.static("images"));

//exporte application pour y acceder depuis d'autre fichier comme le server node
module.exports = app;