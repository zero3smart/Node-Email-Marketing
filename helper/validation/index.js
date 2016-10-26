/**
 * Created by titu on 10/24/16.
 */
const promise = require('bluebird');
const fileHelper = require('../file');
const csvHandler = require('./csv');
const xlxHandler = require('./xlx');
const syntaxValidation = require('./syntax');
const _ = require('lodash');

let startValidation = (directory, files) => {
    return promise.map(files, function (file) {
        return readFileAndRemoveDuplicates(directory, file);
    });
};

let readFileAndRemoveDuplicates = (directory, fileName) => {
    console.log('# parsing file: ' + fileName);

    let filePath = directory + '/' + fileName;
    let uniqueDirectory = directory + '/unique/';
    let uniqueFilePath = uniqueDirectory + fileName;
    let handler = getFileExtension(fileName).toLowerCase() === 'csv' ? csvHandler : xlxHandler;
    let reports = [];

    return fileHelper.ensureDirectoryExists(uniqueDirectory)
        .then(() => handler.readFromFileAndRemoveDupes(filePath))
        .then(syntaxValidation.validate)
        .then((result) => {
            return handler.save(result, uniqueFilePath)
        });
};

let getFileExtension = (fileName) => {
    return fileName.split('.').pop();
};

module.exports = {
    start: startValidation
};