const csv = require('csv-parser');
const stringify = require('csv-stringify/lib/sync');
const fs = require('fs');

const models = require('./models');

// Use schema definitions to create headers for csv parser
scoringData_headers = Object.keys(models.Score.schema.paths);
scoringData_headers = scoringData_headers.filter(item => item != "_id" && item != "__v" && item != 'Downloaded');

compData_headers = Object.keys(models.Competition.schema.paths);
compData_headers = compData_headers.filter(item => item != "_id" && item != "__v" && item !="rounds");

f3kData_headers = Object.keys(models.F3kRound.schema.paths);
f3kData_headers = f3kData_headers.filter(item => item != "_id" && item != "__v");

function csvReader(fileName, headers) {
    return new Promise((resolve, reject) => {
        let results = []
        fs.createReadStream(fileName)
            .pipe(csv({ separator: '|', headers: headers }))
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', () => {
                reject(new Error('File reading error'))
            });
    });
}

async function parseCSV(fileName, headers) {
    try {
        const results = await csvReader(fileName, headers);
        //console.log(results.length, "rows read from", fileName)
        return results;
    }
    catch (err) {
        console.log('Error:', err.message);
    }
}

async function doStuff(){

    
    let index = 0;
    let CompID = "1E22Cfad97c74";
        
    const compRows = await parseCSV(`scoreupload/${CompID}_CompData.csv`, compData_headers);
    let comp = new models.Competition(compRows[0]);
    //console.log(comp);


    console.log(scoringData_headers)
    const scoringRows = await parseCSV(`scoreupload/${CompID}_ScoringData.csv`, scoringData_headers);
    index = 0;
    
    while (index < scoringRows.length){
        test = new models.Score(scoringRows[index]);
        test.save();    
        //console.log(test.CompID);
        //index++;
        index = 9999999;
    }
    
    //console.log("obj", test);    
    //console.log("row", scoringRows[--index]);    

    const f3kRows = await parseCSV(`scoreupload/${CompID}_F3KData.csv`, f3kData_headers);

    index = 0;
    while (index < f3kRows.length){
        test = new models.F3kRound(f3kRows[index]);
        comp.rounds.push(test);  
        //console.log(test.CompID);
        index++;
    }
    //console.log(f3kRows[7]);
    //test = new models.F3k(f3kRows[0]);
    //test.save();
    comp.save();
    console.log(comp.rounds[0]);
    //console.log(db.disconnect);
    //mongoose.disconnect();
    
    let s = stringify(scoringRows, {
        header: true, 
        columns: scoringData_headers,
        delimiter: '|',
        record_delimiter: 'windows',
        cast: {
            boolean: value => {if (value) {return "True"} else {return "False"}}
        }

    });
    //.pipe(process.stdout);
    fs.writeFileSync('scores.csv', s, 'utf-8')

};



//const scoringRows = parseCSV('scoreupload/13D4Aa86ac9db_ScoringData.csv', scoringData_headers);

console.log("doing stuff");

doStuff();

//console.log({id:"test"}.keys())


//

//const comp = models.Competition({id: , date: , rounds: []})
