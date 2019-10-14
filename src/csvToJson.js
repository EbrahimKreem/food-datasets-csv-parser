/* eslint-disable no-unused-vars */
import { write, readDir } from '@groceristar/static-data-generator';

const generateJsonFile = async (fileInfo, data) => {
  // stringify data with indent
  const json = JSON.stringify(data, null, 2);

  await write(`${fileInfo[0]}/${fileInfo[1]}.json`, json);
};

const assign = async (fileInfo, dataEntries) => {
  // @TODO add if env.development and use console.log(xxx)
  const maxEntriesPerFile = 1000;
  const fileCount = Math.ceil(dataEntries.length / maxEntriesPerFile);
  console.log('---assign started---');
  let start;
  let stop;
  const tmpFile = fileInfo;
  const savedFileName = fileInfo[1];
  for (let i = 0; i < fileCount; i += 1) {
    start = i * maxEntriesPerFile;
    if (i + 1 === fileCount) {
      stop = dataEntries.length - 1;
    } else {
      stop = (i + 1) * maxEntriesPerFile - 1;
    }
    const jsonObjects = dataEntries.slice(start, stop);
    tmpFile[1] += `-${i}`; // add i to file name
    generateJsonFile(fileInfo, jsonObjects);
    tmpFile[1] = savedFileName; // delete i from file name so nxt file can have proper i
  }
};

/**
 * @async
 * @param {dirPath} dirPath directory path
 * @param {data} data
 * @returns {Promise<void>} Promise
 */
const csvToJson = async (dirPath, data, split = false) => {
  const files = await readDir(dirPath);

  // find the csv file
  const csvFile = files.find((file) => {
    if (file.split('.')[1] === 'csv') {
      return file;
    }
    return false;
  });

  // save the name of the csv file without the extension
  const fileInfo = [dirPath, ...csvFile.split('.')]; // => ["dirName", "filename", "csv"]

  if (split) {
    assign(fileInfo, data);
  } else {
    generateJsonFile(fileInfo, data);
  }
};

export default csvToJson;
