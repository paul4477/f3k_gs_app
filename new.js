results = [0.1223462345, 0.199999, 2.4999999, 2.5999999];

function roundTenths(number) {
    return Math.floor(number * 10) / 10;
}

console.log(results);
console.log(results.map(Math.floor));
console.log(results.map(roundTenths));