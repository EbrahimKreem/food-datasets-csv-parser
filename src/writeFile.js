// const filePath = require('../files')
const fs = require('fs')
const PATH = require('path')
const srcUtils = require('./../src/utils')
    //const { promisify } = require('util') // ?? it's utils of not *** Answer : NO. It's using for writing data in json
    // const { promisify } = require('util')
    // const _ = require('lodash')

/**
 * for makeReadable()
 * @param {Object} data a json object
 * */
function makeReadable(data) {
    var dataStr = JSON.stringify(data)

    const replaceList = [
      [/{"/g, '{ "'],
      [/{"/g, '{ " '],
      [/},{/g, ' },\n{'],
      [/":/g, '": '],
      [/,"/g, ',\n "']
    ]

    replaceList.forEach((replacer) => {
      dataStr = dataStr.replace(replacer[0], replacer[1])
    })

    return dataStr
}

/**
 * Write in file
 * @param {String} path
 * @param {Object} data
 */
function writeFile(path, data) {
    var dataStr = makeReadable(data)
        //dataStr = '[' + dataStr + ']'
        //console.log(dataStr)
    fs.writeFile(path, dataStr, function(err) {
        if (err)
            return console.log(err)
        console.info(path + ' file generated successfully!')
    })
}

// execute function
// writeFiles()

/**
 * For fixPath()
 * @param {String} path
 */
function fixPath(path) {
    path = PATH.resolve(__dirname, path) // absolute path
    if (path[-1] !== '/') { path = path + '/' } // path correction
    return path
}

/**
 * readData()
 * @param {string} path
 * @param {string} file
 * */
function readData(path, file) {
    console.log(path + file);

    let data = fs.readFileSync(path + file)
    console.log(data);

    let fileData = JSON.parse(data)
    return fileData
}

/**
 * @param {String} folderNamePath
 * @param {String} file
 * @param {Object} fileData
 * @param {var} flag
 * */
function saveFile(folderNamePath, file, fileData, flag) {
    var fileDataLength = fileData.length
    for (var i = 0; i < fileDataLength; i++) {
        var fileName = getFileName(file, fileData[i], flag, i)
        var elementPath = folderNamePath + '/' + fileName
        writeFile(elementPath, fileData[i])
    }
}

/**
 * @param {String} path
 * @param {String} file
 */
function makeFolder(path, file) {
    var folderName = file.slice(0, -5) + '_elements'
    var folderNamePath = path + folderName
    if (srcUtils.isDirectory(folderNamePath)) {
        fs.mkdirSync(folderNamePath)
    }
    return folderNamePath
}

/**
 * For splitObject
 *
 * @describe split large files into single elements
 *
 * @param {String} fullPath
 * @param {var} flag
 * @param {var} keys
 * @param {var} callback
 */
 function splitObject(fullPath, flag = 1,  keys = [], callback) {
     /*
       flag=1 ==> name according to index
       flag=0 ==> name according to "name" attribute
     */
     const file = PATH.basename(fullPath)
     let path = PATH.parse(fullPath).dir

     if (PATH.extname(file) !== '.json') {
         console.log("Require .json file.")
         return
     }

    path = fixPath(path)
    let fileData = readData(path, file) // Reading data...
    var folderNamePath = makeFolder(path, file) // new folder to save splitted files
    saveFile(folderNamePath, file, fileData, flag) // saving files

    if (callback instanceof Function) {
        setTimeout(function() {
            callback(folderNamePath, keys)
        }, 1000)
    }
 }
// execute function
// splitObject()

/**
 * fixFileName()
 * @param {string} fileName
 */
function fixFileName(fileName) {
    fileName = fileName.replace(/ /g, '_') // Replace space with underscore
    fileName = fileName.toLowerCase() // Maintain Uniformity
    return fileName
}

/**
 * getFileName()
 * @param {string} file
 * @param {Object} fileData
 * @param {var} flag
 * @param {var} index
 */
function getFileName(file, fileData, flag, index) {
    var fileName
    if (flag === 1) fileName = index + '-' + file // for example: 23-someJsonFile.json
    else fileName = fileData.name + '.json' // for example: someValueOfName.json
    fileName = fixFileName(fileName)
    return fileName
}

/**
 * For combineObjects()
 * @param {String} path Path of folder where all splitted files are stored
 * @param {var} keys List of keys that are to be removed
 */
function combineObject(path, keys) {
    path = fixPath(path)
    var content = srcUtils.readAllFiles(path) //read all json files
    content = updateContent(content, keys) //modifying structure
    var fileNamePath = path + PATH.basename(path) + "_combined.json" // for example: elements_combined.json
    writeFile(fileNamePath, content) //saving
}

/**
 * For updateContent()
 * @param {var} content
 * @param {var} keys
 */
function updateContent(content, keys) {

    content.forEach((contentElem) => {
      contentElem.forEach((obj) => {
        keys.forEach((key) => {
          delete obj[key]
        })
      })
    })
    return content
}

module.exports = {
    writeFile,
    test,
    splitObject,
    combineObject,
    makeReadable,
    readData
}
