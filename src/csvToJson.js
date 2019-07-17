// @TODO soon we'll replace it carefully with similar code from generator that was perfected and clean up
//https://github.com/GroceriStar/food-datasets-csv-parser/issues/23
import { writeFile } from './writeFile';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import { resolve } from 'path';
import { joinPath } from './utils';

const maxEntries = 10000;
let result = [];
let folderName, numberOfFiles;

// @TODO change the name
const fileWriter = (i, fileName, start, stop) => {
  let data = result.slice(start, stop);
  let jsonPath = `/projects/USFA/${folderName}/${fileName}${i}.json`;
  let combinedPath = joinPath([__dirname, jsonPath]);
  // @TODO change that. it will work only for one case.
  // we can also create a method for path.join, so it wouldn't complicate our code
  // really bad line
  writeFile((combinedPath), data);
}

const splitJsonIntoFiles = (fileName) => {
  for (let i; i <= numberOfFiles; i++) {
    const start = (i - 1) * maxEntries;
    let stop = i * maxEntries;

    if (i === numberOfFiles) {
      stop = result.length + 1;
      fileWriter(i, fileName, start, stop);
      return;
    }

    fileWriter(i, fileName, start, stop);
  }
}

// This is our main method here, right?
const csvToJson = (directory, file, headers) => {
  // @TODO can this be a separated method?
  const fileName = file.split('.')[0];
  const results = [];
  const folder = directory.split('/');

  folderName = folder[folder.length - 1];
  // <--
  // @TODO it's a very long path. we can use our aliases
  // in order to make it shorter. check readme https://github.com/GroceriStar/sd/tree/master/docs#babel-alias

  // @TODO can we also path a variable that combine `${directory}/${file}` together?
  // i mean maybe we can pass into csvToJson one argument instead of two?

  // @TODO I still think that it will be a good task to move out this long `thing` into separated method
  createReadStream(
    resolve(__dirname, `${directory}/${file}`)
  )
    .pipe(
      csv({
        skipLines: 1,
        headers: headers
      })
    )
    .on('data', function (data) {
      results.push(data)
    })
    .on('end', function () {
      numberOfFiles = Math.ceil(results.length / maxEntries)
      result = results
      splitJsonIntoFiles(fileName)
    })
}

export default {
  csvToJson,
}