module.exports = {
    development: {
        port: process.env.PORT,
        privateKey: process.env.PRIVATE_KEY,
        databaseUrl: process.env.URL
    },
    production: {}
};