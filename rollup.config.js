// import cleanup from 'rollup-plugin-cleanup';
// https://github.com/mjeanroy/rollup-plugin-prettier
// https://gitlab.com/IvanSanchez/rollup-plugin-file-as-blob

import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
// import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel'
import pkg from './package.json'



const extensions = [
  '.js'
]

const name = 'FoodDatasetsCSVParser'

const external = [
  'fs',
  'path'
]

let plugins = [

  // Allows node_modules resolution
  resolve({
    extensions,
    browser: true, // fixes ERROR!!! randomBytes(16)
  }),




  // Allows verification of entry point and all imported files with ESLint.
  // @TODO fix and enable eslint for rollup
  // eslint({
  //   /* your options */
  //   fix:true,
  //   throwOnWarning:true,
  //   throwOnError:true

  // }),

  // Allow bundling cjs modules. Rollup doesn't understand cjs
  commonjs({
    ignore: [
      "conditional-runtime-dependency"
    ]
  }),

  // Compile TypeScript/JavaScript files
  babel({
    extensions,
    include: ['src/*'],
    exclude: [
      'node_modules/**',
      // '/src/data/__tests__',
    ]

  }),

  builtins(),
]


export default {
  input: './src/index.js',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external,
  plugins,

  output: [{
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    },
    {
      file: pkg.browser,
      format: 'iife',
      name
      // https://rollupjs.org/guide/en#output-globals-g-globals
      // globals: {}
    }
  ]
}
