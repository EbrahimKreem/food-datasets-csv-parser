// import { join } from 'path';

import {
  mainWrapper
} from '@groceristar/food-dataset-csv-parser';
// import { parseDirectoryFiles, getHeaders } from '@groceristar/food-dataset-csv-parser'

const parserUSFADerivationCode = async () => {
  console.log('--- parserUSFADerivationCode start ---');
  // const headers = getHeaders('./Fish_NV_sum (per 100 g EP).csv');

  // const headers = ['derivation_code', 'Derivation_Descript'];

  // @TODO changes required.
  // we can use module resolver for this
  // const directory = '../../../raw/Derivation_Code_Description';
  // const directory = '../../../raw/Derivation_Code_Description';

  // joining path of directory
  // const directoryPath = join(__dirname, directory);

  // @TODO I don't like that this scripts are
  // called as it is... looks un-cool
  // parseDirectoryFiles(directoryPath, headers);

  // @TODO realize - can babel handle those kind of paths?
  const rawFilePath = `${__dirname}/Derivation_Code_Description.csv`;
  mainWrapper(rawFilePath)

};

export default parserUSFADerivationCode;