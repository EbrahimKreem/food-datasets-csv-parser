/* eslint-disable no-unused-vars */
import { write } from '@groceristar/static-data-generator';
// import { joinPath } from './utils';
import fs from 'fs';
import parseCsv from './parseCsv';

function makeFullPath(pathData, filetype) {
  return ''.concat(pathData[0], pathData[1], filetype); // put pathData + filetype into 1 valid file name string
}

const generate = (file, data) => {
  // file => [full directory path, 'filename', 'filetype']
  const fullPath = makeFullPath(file, '.json');

  console.log('---file writer started---');
  console.log(fullPath);
  console.log('---file writer ended---');

  write(fullPath, data);
};

// @TODO update this method later, when we'll migrate to `write` from generator

// @TODO as this method using "generateJsonFiles" method - it should be updated.
// or maybe move it into generator file, etc.
const assign = (file, dataEntries) => {
  // @TODO add if env.development and use console.log(xxx)
  const maxEntriesPerFile = 10000;
  const fileCount = Math.ceil(dataEntries.length / maxEntriesPerFile);
  console.log('---assign started---');
  let start;
  let stop;
  const fileInfo = file;
  const savedFileName = fileInfo[1];
  for (let i = 0; i < fileCount; i += 1) {
    start = i * maxEntriesPerFile;
    if (i + 1 === fileCount) {
      stop = dataEntries.length - 1;
    } else {
      stop = (i + 1) * maxEntriesPerFile - 1;
    }
    const jsonObjects = dataEntries.slice(start, stop);
    fileInfo[1] += i.toString(); // add i to file name
    generate(fileInfo, jsonObjects);
    fileInfo[1] = savedFileName; // delete i from file name so nxt file can have proper i
  }
};

/**
 * @async
 * @param {dirPath} dirPath directory path
 * @param {data} data
 * @returns {Promise<void>} Promise
 */
const csvToJson = async (dirPath, data) => {
  // stringify data with indent
  const json = JSON.stringify(data, null, 2);

  fs.readdir(dirPath, (err, files) => {
    // find the csv file
    const csvFile = files.find((file) => {
      if (file.split('.')[1] === 'csv') {
        return file;
      }
      return false;
    });
    // save the name of the csv file without the extension
    const fileName = csvFile.split('.')[0];

    // create a JSON file with the data provided
    fs.writeFile(`${dirPath}/${fileName}.json`, json, () => {
      console.log('successfully wrote file');
    });
  });
};

export default csvToJson;
