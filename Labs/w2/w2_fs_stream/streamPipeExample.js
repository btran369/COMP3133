const fs = require('fs')
const readStream = fs.createReadStream('read_stream.txt')
const writeStream = fs.createWriteStream('write_pipe_stream.txt')

readStream.pipe(writeStream)

writeStream.on('finish', ()=>{
    
})