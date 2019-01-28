const {getMemesDb} = require('./lib/meme_data'),
    {downloadAllMemes} = require('./lib/files.js'),
    {uploadAllFiles, publicAllFiles} = require('./lib/uploader'),
    {delayPerPage} = require('./config');

async function memesFunnel(memes){
    try {
        memes = await downloadAllMemes(memes);
        await uploadAllFiles(memes);
        memes = await publicAllFiles(memes);
    } catch (err) {
        console.log(`[Memegeddon][ERROR][SYSTEM FAILURE] MemeFunnel has broken.`);
        console.error(err);
    }
}


getMemesDb("http://alpha-meme-maker.herokuapp.com", delayPerPage)
    .on("data", memesFunnel)
    .on("end",  data => console.log("-- TOTAL MEMES:", data.length))
    .on("error", console.log);