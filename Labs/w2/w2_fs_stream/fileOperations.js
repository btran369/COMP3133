const fs = require('fs');
const path = require('path');

// Define the file path
const filePath = path.join(__dirname, 'output.txt');

fs.stat(filePath, (err, stats) => {
    if (err){
        console.error("Error retrieving file stats:", err)
        return
    }
    console.log("File stats:", stats)
})