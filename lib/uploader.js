const {Storage} = require('@google-cloud/storage'),
    {gcs, paths} = require('../config');

const projectId = gcs.projectId,
    bucketName = gcs.bucketName,
    bucketUrl = `gs://${bucketName}`,
    storage = new Storage({projectId});

async function makePublicFile (meme) {
    return new Promise((resolve, reject) => {
    storage
        .bucket(bucketUrl)
        .file(`${gcs.memesPath}/${meme.id}`)
        .makePublic()
        .then(()=>{
            meme.url = `https://storage.googleapis.com/${bucketName}/${gcs.memesPath}/${meme.id}`;
            console.log(`[Memegeddon][UPLOADER][INFO] Meme ${meme.id} is public now as ${meme.url}`);
            resolve(meme);
        })
        .catch(reject);
    });
}


function uploadFile (meme) {
    const filePath = `${paths.memes}/${meme.id}.${meme.extension}`;
    const destination = `${gcs.memesPath}/${meme.id}`;
    return new Promise((resolve, reject) => {
        storage
            .bucket(bucketUrl)
            .upload(filePath, {destination})
            .then(() => {
                console.log(`[Memegeddon][UPLOADER][INFO] Uploaded Meme ${meme.id} to ${bucketUrl}`);
                resolve(meme);
            })
            .catch(reject);
    });
}


function uploadAllFiles (memes){
    return Promise.all(memes.map(uploadFile));
}

function publicAllFiles (memes) {
    return Promise.all(memes.map(makePublicFile));
}

module.exports = {uploadAllFiles, publicAllFiles};