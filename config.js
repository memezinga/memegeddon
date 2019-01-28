module.exports = {
    paths: {
        memes: `${__dirname}/memes`,
        data: `${__dirname}/data`,
        backup: `${__dirname}/backup`,
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
    delayPerPage: 4000,
    cleanUpAndBackup: true
};