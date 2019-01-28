const request = require('request'),
    mime = require('mime'),
    fs = require('fs'),
    {paths} = require('../config');

function getMetadata (meme){
    return new Promise((resolve, reject) => {
        console.log(`[Memegeddon][Download][IMG][INFO] Metadata adquisition ${meme.img_src}`);

        request.head(meme.img_src, (err, res, body) => {
            if(err) {
                reject(err);
            } else {
                const contentType = res.headers['content-type'];
                meme["content-type"] = contentType;
                meme.extension = mime.getExtension(contentType);
                resolve(meme);
            }
        });


    });
}

function getRequest(meme){
    const filePath = `${paths.memes}/${meme.id}.${meme.extension}`;
    return new Promise((resolve, reject) => {
        console.log(`[Memegeddon][Download][IMG][INFO] File adquisition ${meme.img_src} to ${filePath}`);
        request(meme.img_src)
            .pipe(fs.createWriteStream(filePath))
            .on('close', () => {
                resolve(meme);
            })
            .on('error', () => reject());
    });
}



function downloadAllMemes (memes) {
    return Promise.all(memes.map(downloadMeme));
}

function downloadMeme (meme) {
    return getMetadata(meme).then(getRequest);
}

module.exports = {downloadMeme, downloadAllMemes};