// const path = require('path');

// @TODO update require. when we export this method - we can connect it from index.js
const { parseCsv, csvToJson } = require(`${process.cwd()}/dist/index.cjs`);

async function Main() {
  // const fileName = `Fish_NV_sum (per 100 g EP).csv`;
  const rawFilePath = `${__dirname}/Fish_NV_sum (per 100 g EP).csv`;
  const data = await parseCsv(rawFilePath);
  await csvToJson(__dirname, data);
}
Main();
