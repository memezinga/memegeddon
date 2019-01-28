const {getMemesDb} = require('./lib/digester'),
    {downloadAllMemes} = require('./lib/downloader.js'),
    {uploadAllFiles, publicAllFiles} = require('./lib/uploader'),
    {saveFile, timestamp} = require('./lib/utils'),
    {delayPerPage, paths} = require('./config'),
    {saveMemes} = require('./lib/database');

async function stopEngine(originalMemes){
    console.log("-- TOTAL MEMES:", originalMemes.length);
    process.exit();
}

async function memesFunnel(memes){
    try {
        memes = await downloadAllMemes(memes);
        await uploadAllFiles(memes);
        memes = await publicAllFiles(memes);
        await saveFile(`${paths.data}/${timestamp()}.json`, JSON.stringify(memes), "utf8");
        await saveMemes(memes);
    } catch (err) {
        console.log(`[Memegeddon][ERROR][SYSTEM FAILURE] MemeFunnel has broken.`);
        console.error(err);
    }
}


getMemesDb("http://alpha-meme-maker.herokuapp.com", delayPerPage)
    .on("data", memesFunnel)
    .on("end",  stopEngine)
    .on("error", console.log);