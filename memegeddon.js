const {getMemesDb} = require('./lib/digester'),
    {downloadAllMemes} = require('./lib/downloader.js'),
    {uploadAllFiles, publicAllFiles} = require('./lib/uploader'),
    {saveFile, timestamp, getFile, listFiles, zipDirectory, removeFolder} = require('./lib/utils'),
    {delayPerPage, paths, cleanUpAndBackup} = require('./config'),
    {saveMemes} = require('./lib/database');

async function stopEngine(originalMemes){
    try {
        const files = await listFiles(paths.data);
        const filesContent = await Promise.all(files.map(file => getFile(`${paths.data}/${file}`, 'utf8')));
        let memes = filesContent
                    .map(data => JSON.parse(data))
                    .reduce((a,b) => a.concat(b));
        
        if(cleanUpAndBackup){
            await saveFile(`${paths.memes}/data.json`, JSON.stringify(memes), "utf8");
            await zipDirectory(paths.memes, `${paths.backup}/${timestamp()}.zip`);
            await Promise.all([paths.memes, paths.data].map(folder => removeFolder(`${folder}/*`)));
        } else {
            await saveFile(`${paths.data}/data.json`, JSON.stringify(memes), "utf8");
        }
        
        if(originalMemes.length === memes.length){
            console.log(`[Memegeddon][INFO][~(^-^)~] All memes are stores as expected. Congratulations, haters gonna hate!`);
            process.exit(50); //@TODO: use a better exit code?
        } else {
            console.log(`[Memegeddon][ERROR][SYSTEM FAILURE][(⩾﹏⩽)] stopEngine has loses some memes in the process!!`);
            process.exit(1);
        }
        
    } catch(err) {
        console.log(`[Memegeddon][ERROR][SYSTEM FAILURE][(⩾﹏⩽)] stopEngine has broken!`);
        console.error(err);
    }
}

async function memesFunnel(memes){
    try {
        memes = await downloadAllMemes(memes);
        await uploadAllFiles(memes);
        memes = await publicAllFiles(memes);
        await saveFile(`${paths.data}/${timestamp()}.json`, JSON.stringify(memes), "utf8");
        await saveMemes(memes);
    } catch (err) {
        console.log(`[Memegeddon][ERROR][SYSTEM FAILURE][(⩾﹏⩽)] MemeFunnel has broken.`);
        console.error(err);
    }
}



getMemesDb("http://alpha-meme-maker.herokuapp.com", delayPerPage)
    .on("data", memesFunnel)
    .on("end",  stopEngine)
    .on("error", err => {
        console.log(`[Memegeddon][ERROR][SYSTEM FAILURE][ಠ_ಠ] getMemesDb has broken. Time to run in circles!`);
        console.error(err);
    });
    
