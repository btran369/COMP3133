const fs = require('fs');
const path = require('path');

// Define the file path
const filePath = path.join(__dirname, 'output.txt');

const dataToWrite = 'Hello, this is a sample text written to the file.\n';

// Write to the file Synchronously
try {
    fs.writeFileSync(filePath, dataToWrite, 'utf8');
    console.log('File written successfully (synchronously).');
} catch (error) {
    console.error('Error writing the file:', error);
}

// Write to the file Asynchronously
fs.writeFile(filePath, dataToWrite, 'utf8', (err) => {
    if (err) {
        console.error('Error writing the file:', err);
        return;
    }
    console.log('File written successfully (asynchronously).');
})