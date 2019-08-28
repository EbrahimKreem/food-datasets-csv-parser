import { createReadStream } from 'fs';
import csv from 'csv-parser';
import { resolve } from 'path';
// @TODO soon we'll replace it carefully
// with similar code from generator that was perfected and clean up
// https://github.com/GroceriStar/food-datasets-csv-parser/issues/23
import { write } from '@groceristar/static-data-generator';
import { joinPath } from './utils';

// @TODO I don't like how this file was previously created.
// I mean why we have this variables from the outside of our functions,
// is there some intersections, etc.
// I think we can improve it very easy.


let folderName;


const generateJsonFiles = (i, fileName, start, stop) => {
  const data = result.slice(start, stop);

  // @TODO change that
  // we can also create a method for path.join, so it wouldn't complicate our code
  // really bad line
  const jsonPath = `/projects/${fileName}${i}.json`;
  const combinedPath = joinPath([__dirname, jsonPath]);
  console.log('---file writer started---');
  console.log(folderName);
  console.log(jsonPath);
  console.log(combinedPath);
  console.log('---file writer ended---');

  // --> if you reading it - then it's time for updating it :)

  write(combinedPath, data);
};

// @TODO update this method later, when we'll migrate to `write` from generator
// @TODO as this method using "generateJsonFiles" method - it should be updated.
// or maybe move it into generator file, etc.
const splitJsonIntoFiles = (fileName, maxEntriesPerFile, numberOfFiles) => {
  // @TODO add if env.development and use console.log(xxx)
  console.log('---splitJson started---');
  for (let i = 0; i < numberOfFiles; i++) { 
    const start = i * maxEntriesPerFile; 
    let stop = ((i+1) * maxEntriesPerFile) - 1;
    //0-9999,10000-19999,20000...etc

    if (i+1 == numberOfFiles) { //last file
      stop = result.length + 1;
      generateJsonFiles(i, fileName, start, stop);
      return; //end the for loop here
    }
.
    //seems like this is the statement that is usually run in this for loop
    generateJsonFiles(i, fileName, start, stop);
  }
};

// @TODO This is our main method here, right?
// I don't like the name for this method and for the whole file
// if it's main - then let's put it into index.js
const csvToJson = (directory, file, headers) => {
  // @TODO when we'll have getHeaders method working, should we call it inside of this method?
  // @TODO can this be a separated method?
  const maxEntriesPerFile = 10000;
  let result = [];
  let numberOfFiles;
  
  const fileName = file.split('.')[0];
  const folder = directory.split('/');

  folderName = folder[folder.length - 1];
  // <--
  // @TODO it's a very long path. we can use our aliases
  // in order to make it shorter. check readme https://github.com/GroceriStar/sd/tree/master/docs#babel-alias

  // @TODO can we also path a variable that combine `${directory}/${file}` together?
  // i mean maybe we can pass into csvToJson one argument instead of two?

  // @TODO I still think that it will be a good task
  // to move out this long `thing` into separated method
  const jsonFilePath = resolve(__dirname, `${directory}/${file}`);
  createReadStream(jsonFilePath)
    .pipe(
      csv({
        skipLines: 1,
        headers,
      }),
    )
    .on('data', (data) => {
      result.push(data);
    })
    .on('end', () => {
      numberOfFiles = Math.ceil(result.length / maxEntriesPerFile);
      splitJsonIntoFiles(fileName, maxEntriesPerFile, numberOfFiles);
    });
};

export default csvToJson;
