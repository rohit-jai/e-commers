const { createLogger,transports,format} = require('winston')
const { url } = require("@database/config")
require('winston-mongodb')


const logger = createLogger({
    transports:[
        new transports.File({
            filename:'info.log',
            level:'info',
            format:format.combine(format.timestamp(), format.json())
        }),
        new transports.MongoDB({
            level:'error',
            db:url,
            options:{
                useUnifiedTopology: true
            },
            collection:'logger',
            format:format.combine(format.timestamp(), format.json())
        })

    ]
})


module.exports = logger;