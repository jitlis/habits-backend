const whitelist = require("./whitelist");

const corsConfig = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 204
}

module.exports = corsConfig;