const fs = require('fs');
const path = require('path');

// Define the file path
const filePath = path.join(__dirname, 'output.txt');

const dataToAppend = 'Appending this line to the file.\n';
// Append to the file Synchronously
try {
    fs.appendFileSync(filePath, dataToAppend, 'utf8');
    console.log('File appended successfully (synchronously).');
} catch (error) {
    console.error('Error appending to the file:', error);
}

// Append to the file Asynchronously
fs.appendFile(filePath, dataToAppend, 'utf8', (err) => {
    if (err) {
        console.error('Error appending to the file:', err);
        return;
    }
    console.log('File appended successfully (asynchronously).');
});
