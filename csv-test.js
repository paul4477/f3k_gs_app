const csv = require('csv-parser');
const fs = require('fs');

f3k_headers = [
    'compID', //0
    'compType', //1
    'roundNo', //2
    'groupNo', //3
    'reFlightNo', //4
    'pilotNo', //5
    'seqNo', //6
    'data1', //7
    'data2', //8
    'data3', //9
    'data4', //10
    'data5', //11
    'data6', //12
    'data7', //13
    'penalty', //14
    'pilotName', //15
    'startNo', //16
    'dateCreated', //17
    'updated', //18
    'originalRoundNo', //19
    'landingOver75m', //20
    'progressiveTotalScore', //21
    'progressiveRank', //22
    'progressivePercent', //23
    'resultsToRoundNo', //24
    'progressiveHiddenRank', //25
    'rawScore', //26
    'normalisedScore', //27
    'taskNo', //28
    'country', //29
    'helperName', //30
    'pilotNo', //31
]

function resultsReader(fileName) {
    return new Promise((resolve, reject) => {
        let results = []
        fs.createReadStream(fileName)
            .pipe(csv({ separator: '|', headers: f3k_headers }))
            .on('data', (row) => {
                results.push(row);
                //console.log("DATA");
            })
            .on('end', () => {
                //console.log(results);
                //console.log("EOF");
                
                resolve(results);
                //return results;
            })
            .on('error', () => {
                reject(new Error('File reading error'))
            });
    });
}


//resultsReader('scoreupload/1E22Cfad97c74_ScoringData.csv')
//.then(results => console.log(results[0]))
//.catch(err => console.log('Error', err.message));

async function handleResults() {
    try {
        const results = await resultsReader('scoreupload/1E22Cfad97c74_ScoringData.csv');
        console.log(results[0]);
    }
    catch (err) {
        console.log('Error:', err.message);
    }
}

handleResults();
/*
async function readResults(fileName){
    const results = await resultsReader(fileName);
    console.log('AWAITED')
    console.log(results);
};

console.log(readResults('scoreupload/1E22Cfad97c74_ScoringData.csv')); */
