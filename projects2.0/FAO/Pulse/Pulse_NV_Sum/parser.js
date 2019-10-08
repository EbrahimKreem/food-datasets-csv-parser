// const path = require('path');
// @TODO update require. when we export this method - we can connect it from index.js
const { csvToJson, parseCsv } = require('../../../../dist/index.cjs');

async function Main() {
  const rawFilePath = `${__dirname}/Pulse_NV_sum (per 100 g EP on FW).csv`;
  const data = await parseCsv(rawFilePath);
  await csvToJson(__dirname, data);
}
Main();
