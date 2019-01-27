const {getMemesDb} = require('./lib/meme_data')

getMemesDb("http://alpha-meme-maker.herokuapp.com", 1000)
    .on("data", data => console.log("-- TOTAL Memes in Page:", data.length))
    .on("end",  data => console.log("-- TOTAL MEMES:", data.length))
    .on("error", console.log);