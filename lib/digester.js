const request = require('request'),
    {filter} = require('asyncro'),
    EventEmitter = require('events'),
    {sleep, isBetween, idGenerator} = require('./utils');

const downloadEmitter = new EventEmitter();

function harmonizeMemes (memes) {
    return memes.map(meme => {
        meme.id_src = meme.ID;
        meme.id = idGenerator();
        meme.img_src = meme.image;
        meme.tags = meme.tags ? meme.tags.split(", ") : [];
        delete meme.ID;
        delete meme.image;
        return meme;
    });
}

function validUrl (url){
    return new Promise ((resolve) => {
        request(url, (error, response, body) => {
            if(error || !isBetween(response.statusCode, 200, 299)) {
                console.log(`[Memegeddon][Download][Check-url][INFO] discarted ${url}`);
                resolve(false);
            } else {
                console.log(`[Memegeddon][Download][Check-url][INFO] validated ${url}`);
                resolve(true);
            }
        });
    });
}

function getMemePage (baseUrl, page=1) {
    const url = `${baseUrl}/${page}`;
    console.log(`[Memegeddon][Download][INFO] Start meme data for page ${page}`);
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if(error || !isBetween(response.statusCode, 200, 299)) {
                reject(error);
            } else {
                const data = JSON.parse(body);
                console.log(`[Memegeddon][Download][INFO] meme data downloaded. Total: ${data.data.length}. Page: ${page}`);
                resolve(data);
            }
        });
    });
}

exports.getMemesDb =  function (url, delay=0) {
    setTimeout(async ()=>{
        let page = 1;
        let res = false;
        let all = [];
        do {
            try {
                if(delay){
                    console.log(`[Memegeddon][Download][INFO] Sleep for ${delay}ms`);
                    await sleep(delay);
                }
                res = await getMemePage(url, page);
                const data = res.data;
                if(data.length > 0) {
                    const validMemes = await filter(res.data, async meme => validUrl(meme.image));
                    const memes = harmonizeMemes(validMemes)
                    all = all.concat(memes);
                    console.log(`[Memegeddon][Download][INFO] Memes valid data for ${validMemes.length} items`);
                    downloadEmitter.emit("data", memes);
                }
                
                page++;
                
            } catch (e) {
                console.log(`[Memegeddon][Download][ERROR] ${e}`);
                downloadEmitter.emit("error", e);
            }
        } while(res.next);
        
        console.log(`[Memegeddon][Download][INFO] Meme download tasks has ended`);
        downloadEmitter.emit("end", all);
    }, delay);
    return downloadEmitter;
};
