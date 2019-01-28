module.exports = {
    paths: {
        memes: `${__dirname}/memes`,
        data: `${__dirname}/data`
    },
    firebase: {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""
    },
    gcs: {
       projectId: '',
       bucketName: '',
       memesPath: ''
    },
    delayPerPage: 4000 
};