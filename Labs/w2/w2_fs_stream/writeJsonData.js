const fs = require('fs');
const path = require('path');

// Define the file path
const filePath = path.join(__dirname, 'user.json');
const userData = [{
    name: "John Doe",
    age: 30,
    city: "New York"
}];
const jsonData = JSON.stringify(userData, null, 2); // Pretty print with 2 spaces
// Write JSON data to the file Synchronously
try {
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log('JSON data written successfully (synchronously).');
} catch (error) {
    console.error('Error writing JSON data to the file:', error);
}