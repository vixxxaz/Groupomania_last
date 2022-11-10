const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: {type: String, required:false},
    message: { type: String, required: false },
    imageUrl: { type: String, required: false  },
    likes: { type: Number, default: 0, required: true },
    //likes: { type: [String], required: false  },
    dislikes: { type: Number, default: 0, required: true },
    usersLiked: { type: Array, default: [], required: true },
    //usersLiked: { type: String, required: false },
    usersDisliked: { type: Array, default: [], required: true },  
    createdDate: { type: Date, default: Date.now, required: false },
});

module.exports = mongoose.model('Post', postSchema);