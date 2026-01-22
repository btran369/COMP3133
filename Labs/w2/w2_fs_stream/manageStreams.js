const fs = require('fs');
const path = require('path');

// Define the file path
const filePath = path.join(__dirname, 'read_stream.txt');
// Create a readable stream
// const readStream = fs.createReadStream(filePath, { encoding: 'utf8', highWaterMark: 16 });
const readStream = fs.createReadStream(filePath);

// Handle 'data' event
readStream.on('data',(chuck)=>{
    console.log('--- New Chunk ---');
    console.log(chuck.toString());
});

// Handle 'end' event
readStream.on('end',()=>{
    console.log('No more data to read.');
});
// Handle 'error' event
readStream.on('error',(err)=>{
    console.error('Error reading the file:', err);
});

// Pause the stream after 100ms
setTimeout(() => {
    console.log('Pausing the stream...');
    readStream.pause();
}, 100);

// Resume the stream after another 2 seconds
setTimeout(() => {
    console.log('Resuming the stream...');
    readStream.resume();
}, 2100);

console.log('Stream management script is running...');
// Write Stream Examples
const outputFilePath = path.join(__dirname, 'write_stream.txt');
const writeStream = fs.createWriteStream(outputFilePath, { encoding: 'utf8' });

// Write data to the stream
writeStream.write('Hello, World!\n');
writeStream.write('This is a test of the write stream.\n');

// End the stream
writeStream.end('This is the end of the write stream.\n');
//writeStream.write('Hello, World!\n');// This write will be ignored as the stream has ended.
// Handle 'finish' event
writeStream.on('finish', () => {
    console.log('All data has been written to the file.');
});

// Handle 'error' event
writeStream.on('error', (err) => {
    console.error('Error writing to the file:', err);
});