//variable du model post
const Post = require('../models/PostModel');

//module de gestion des fichier
const fs = require('fs');

//variable pour le model user
const User = require('../models/User');


//fonction création de post
exports.createPost = (req, res, next) => {

    //va chercher l'user en comparant l id
    User.findOne({ _id: req.auth.userId })

        .then(user => {
            //si il n'y a pas d image, creer le post sans avec les données de la requete
            if (typeof req.file == 'undefined') {
                var post = new Post({
                    ...req.body,
                    userId: req.auth.userId,
                    createdDate: Date.now(),//ajoute la date d'haujourd'hui
                });
            } else {
                //si il y a une image creer avec l adresse de l image
                var post = new Post({
                    ...req.body,
                    userId: req.auth.userId,
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                    createdDate: Date.now(),
                });
            }
            //sauve le post dans la base de données
            post.save()
                .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
                .catch(error => { res.status(400).json({ error }) })
        })
};


//recuperer un post
exports.getOnePost = (req, res, next) => {

    //trouver un model de post en comparant l'id
    Post.findOne({
        _id: req.params.id
    }).then(
        (post) => {
            res.status(200).json(post);//ajoute le poste a la reponse
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

//fonction modifier un post
exports.modifyPost = (req, res, next) => {
    //trouver le post 
    Post.findOne({ _id: req.params.id })

        .then(post => {
            //verifie si l user id correspond et si l user a le statut d'admin
            if (post.userId != req.auth.userId && post.admin === false) {
                res.status(401).json({ message: 'Not authorized ' });

            } else {
                //si il ny a pas d'image
                if (typeof req.file == 'undefined') {

                    //creer le nouveau post avec les données de la requete
                    const post = new Post({
                        _id: req.params.id,
                        title: req.body.title,
                        message: req.body.message,
                    });

                    //met a jour le post
                    Post.updateOne({ _id: req.params.id }, post)
                    .then(
                        () => {
                            res.status(201).json({
                                message: 'Post updated successfully!'
                            });
                        }
                    ).catch(
                        (error) => {
                            res.status(400).json({
                                error: error
                            });
                        }
                    );
                } else {
                    //si il y a une image creer le nouveau post
                    const post = new Post({
                        _id: req.params.id,
                        title: req.body.title,
                        message: req.body.message,
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                    });
                    //met a jour le post
                    Post.updateOne({ _id: req.params.id }, post).then(
                        () => {
                            res.status(201).json({
                                message: 'Post updated successfully!'
                            });
                        }
                    ).catch(
                        (error) => {
                            res.status(400).json({
                                error: error
                            });
                        }
                    );
                }
            }
        })
}


//fonction effacer un post
exports.deletePost = (req, res, next) => {

    //check de l user
    User.findOne({ _id: req.auth.userId })
        .then(user => {
            //trouve le post
            Post.findOne({ _id: req.params.id })
                .then(post => {
                    //verifie les id de l user et si admin
                    if (post.userId == req.auth.userId || user.admin == true) {
                        //si il n y a l'image
                        if ((typeof post.imageUrl) !== 'undefined') {
                            const filename = post.imageUrl.split('/images/')[1];
                            //efface l image du backend
                            fs.unlink(`images/${filename}`, () => {
                                Post.deleteOne({ _id: req.params.id })
                                    .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                                    .catch(error => res.status(401).json({ error }));
                            });
                        } else {
                            //pas d image efface juste le post
                            Post.deleteOne({ _id: req.params.id })
                                .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                                .catch(error => res.status(401).json({ error }));
                        }
                    } else {
                        res.status(401).json({ message: 'Not authorized ' });
                    }
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
        })
};


//recupere tous les post
exports.getAllPost = (req, res, next) => {
    //trouver les post
    Post.find()
    .then(
        (posts) => {
            res.status(200).json(posts);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};



//fonction pour liker les posts
exports.likePost = (req, res) => {

    //si il like
    if (req.body.like === 1) {
        Post.updateOne({ _id: req.params.id }, {
            $inc: { likes: req.body.like++ },
            $push: { usersLiked: req.body.userId },
        }
        )
            .then((post) => res.status(200).json({ message: "like" }))
            .catch((error) => res.status(400).json({ error }));
    }

    //si unlike
    else if (req.body.like === -1) {
        Post.updateOne(
            { _id: req.params.id },
            {
                $inc: { dislikes: req.body.like++ * -1 },
                $push: { usersDisliked: req.body.userId },
            }
        )
            .then((post) =>
                res.status(200).json({ message: "dislike" })
            )
            .catch((error) => res.status(400).json({ error }));
    }

    
    else if (req.body.like === 0) {
        Post.findOne({ _id: req.params.id })
            .then((post) => {
                if (post.usersLiked.includes(req.body.userId)) {
                    Post.updateOne(
                        { _id: req.params.id },
                        { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
                    )
                        .then((post) => {
                            res.status(200).json({ message: "supp like" });
                        })
                        .catch((error) => res.status(400).json({ error }));
                } else if (post.usersDisliked.includes(req.body.userId)) {
                    Post.updateOne(
                        { _id: req.params.id },
                        {
                            $pull: { usersDisliked: req.body.userId },
                            $inc: { dislikes: -1 },
                        }
                    )
                        .then((post) => {
                            res.status(200).json({ message: "supp dislike" });
                        })
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};

