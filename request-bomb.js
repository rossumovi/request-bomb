const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');

const file = './file.csv';
const delayInMilliseconds = 1000;
const options = {
  host: 'https://localhost:8080',
  path: '/endpoint',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000,
};

const axiosInstance = axios.create({
  baseURL: options.host,
  timeout: options.timeout,
});

const bomb = (rows) => {
  let counter = 1;
  rows.map(async (row) => {
    setTimeout(async () => {
      await axiosInstance.post(options.path, row, { headers: options.headers })
        .then((response) => console.log(row))
        .catch((error) => console.log(error))
    }, delayInMilliseconds * counter)
    counter++;
  })
}

const main = () => {
  let results = [];
  fs.createReadStream(file)
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => bomb(results) );
}

main();
