const admin = require('firebase-admin'),
    serviceAccount = require('../secrets/secrets.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();
const memesDbRef = db.collection("memes");

function saveMeme (meme){
    return new Promise((resolve, reject) => {
        memesDbRef
            .doc(meme.id)
            .set(meme)
            .then(() => {
                resolve(meme);
            })
            .catch(reject);        
    });
}

exports.saveMemes = memes => {
    return Promise.all(memes.map(saveMeme));
};
