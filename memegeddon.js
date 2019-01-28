const {getMemesDb} = require('./lib/meme_data')
const {downloadAllMemes} = require('./lib/files.js')

async function memesFunnel(memes){
    memes = await downloadAllMemes(memes)
}


getMemesDb("http://alpha-meme-maker.herokuapp.com", 30000)
    .on("data", memesFunnel)
    .on("end",  data => console.log("-- TOTAL MEMES:", data.length))
    .on("error", console.log);