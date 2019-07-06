import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'
// import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel'
import pkg from './package.json'

// import cleanup from 'rollup-plugin-cleanup';
// https://github.com/mjeanroy/rollup-plugin-prettier
// https://gitlab.com/IvanSanchez/rollup-plugin-file-as-blob

const extensions = [
    '.js'
]

const name = 'FoodDatasetsCSVParser'

const external = [
    'fs',
    'path'
]

export default {
  input: './src/index.js',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: external,

  plugins: [

    // replace({}),

    // Allows node_modules resolution
    resolve({
      extensions,
      browser: true, // fixes ERROR!!! randomBytes(16)
    }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({
      ignore: ["conditional-runtime-dependency"]
    }),

    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      include: ['src/*'],
      // include: ['src/**/*'],
      exclude: [
        'node_modules/**',
        // '/src/data/__tests__',
        'src/settings.json'
      ]
      // exclude: 'node_modules/**'
      // presets: presets,
      // plugins: plugins
    }),
    builtins(),
  ],
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
