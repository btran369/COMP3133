const fs = require('fs');
const path = require('path');

//Read Current Directory
fs.readdir(__dirname, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }
    console.log('Current Directory Files:', files);
    files.forEach(file => {
        const filePath = path.join(__dirname, file);
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error('Error retrieving stats for file:', file, err);
                return;
            }
            console.log(`Stats for ${file}:`);
            console.log('  Size:', stats.size, 'bytes');
            console.log('  Created At:', stats.birthtime);
            console.log('  Is File:', stats.isFile());
            console.log('  Is Directory:', stats.isDirectory());
        });
    })
});