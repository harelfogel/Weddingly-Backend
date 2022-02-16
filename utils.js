const fs= require('fs');
const logger= require('./logger/logger');

function writeDataToFile(filename,content) {
    fs.writeFileSync(filename,JSON.stringify(content),'utf8',(err) => {
        if(err){
            logger.error(error);
        }
    })
}

function writeTxtFile(filename, content){
    fs.appendFile(filename,content,(err) => {
         
        if(err){
            logger.error(error);
        }
    })
}

const fileLogger = fs.createWriteStream('log.txt', { flags: 'a' }, (err) => {
    if (err) {
        return console.error(`can't open file log.txt ${err}`);
    }
});


function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = ''

            req.on('data', (chunk) => {
                body += chunk.toString()
            })

            req.on('end', () => {
                resolve(body)
            })
        } catch (error) {
            reject(err)
        }
    })
}

module.exports= {
    writeDataToFile,
    writeTxtFile,
    getPostData,
    fileLogger
}