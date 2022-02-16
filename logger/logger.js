
const {format,createLogger,transports} = require('winston');
const {timestamp,combine,printf}= format;

const logFormat = printf(({level,message,timestamp}) => {
    return `${timestamp} : ${message}`;
});


const logger = createLogger({
    format: combine(
        format.colorize(),
        timestamp({format:'YYYY-MM-DD HH:mm:ss'})
        ,logFormat
        ),
    transports:[new transports.Console()],
    // create stream for log.txt
});

module.exports=logger;


