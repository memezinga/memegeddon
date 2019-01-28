const firebase = require("firebase"),
    config = require('../config');

firebase.initializeApp(config.firebase);
const db = firebase.database();
const memesDbRef = db.ref("memes");

function saveMeme (meme){
    return new Promise((resolve, reject) => {
        memesDbRef.child(meme.id).set(meme, err => {
            console.log(`[Memegeddon][Firebase][INFO] processed ${meme.id}`);
            err ? reject(err) : resolve(meme);
        });
    });
}

exports.saveMemes = memes => {
    return Promise.all(memes.map(saveMeme));
};
