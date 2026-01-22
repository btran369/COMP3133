const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')

const csvFilePath = path.join(__dirname, 'input_countries.csv');
const canFilePath = path.join(__dirname, 'canada.txt')
const usaFilePath = path.join(__dirname, 'usa.txt')

var canCount = 0
var usaCount = 0
try {
    fs.rmSync(canFilePath, { force: true });
    console.log(`File deleted: ${canFilePath}`);
} catch (err) {
    console.error(`Error deleting file: ${err.message}`);
}

try {
    fs.rmSync(usaFilePath, { force: true });
    console.log(`File deleted: ${usaFilePath}`);
} catch (err) {
    console.error(`Error deleting file: ${err.message}`);
}

fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('resume', ()=>{
        console.log('--------------------------\nReading file.\n-----------------------')
    })
    .on('data', (row) => {
        if (row['country'] == 'Canada'){
            console.log(`Canada data filtered # ${++canCount}`)
            fs.appendFileSync('canada.txt', JSON.stringify(row) + "\n", 'utf-8')
        }
        if (row['country'] == 'United States'){
            console.log(`US data filtered # ${++usaCount}`)
            fs.appendFileSync('usa.txt', JSON.stringify(row) + "\n", 'utf-8')
        }
    })
    .on('end', () => {
        console.log("--------------------------\nFinished reading file.")
    })
    .on('close', () => {
        console.log("--------------------------\nClosing stream.")
    })
