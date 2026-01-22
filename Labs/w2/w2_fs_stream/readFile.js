const fs = require('fs');
const path = require('path');

// Define the file path
const filePath = path.join(__dirname, 'input.txt');
console.log('Reading file from path:', filePath);

//Read the file synchronously
try {
    const result = fs.readFileSync(filePath, 'utf8');
    console.log('File contents 1:', result);
} catch (error) {
    console.error('Error reading the file:', error);
}

//Read the file asynchronously
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    console.log('File contents 2:', data);
})

console.log('--- END ---');