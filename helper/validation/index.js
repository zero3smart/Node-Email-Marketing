/**
 * Created by titu on 10/24/16.
 */
const promise = require('bluebird');
const fileHelper = require('../file');
const syntaxValidation = require('./syntax');
const staticRemover = require('./staticlistremover/index');
const commonHelper = require('../common');
const settings = require('../../config/settings');
const log = require('../log');
const dbHelper = require('../database');


let startValidation = (directory, files, header, scrubOptions, dirPath) => {
    return promise.map(files, function (file) {
        log.info('readFileAndRemoveDuplicates');
        return readFileAndRemoveDuplicates(directory, file, header, scrubOptions, dirPath);
    }).then((result) => {
        log.info('staticRemover.start');
        return staticRemover.start(result, header, scrubOptions);
    });
};

let readFileAndRemoveDuplicates = (directory, fileName, header, scrubOptions, dirPath) => {

    let filePath = directory + '/' + fileName;
    let cleanDirectory = directory + '/' + dirPath + '/';
    let fileExtension = commonHelper.getFileExtension(fileName).toLowerCase();
    let handler = commonHelper.geFileHandler(fileExtension);
    let delimiter = null;

    return fileHelper.ensureDirectoryExists(cleanDirectory)
        .then(() => handler.readFromFileAndRemoveDupes(filePath, header, scrubOptions))
        .then((result) => {
            result.report = result.report || {};
            if(result.delimiter) {
                delimiter = result.delimiter;
            }
            result.report.delimiter = delimiter;
            return syntaxValidation.validate(result, header, scrubOptions);
        })
        .then((result) => {
            if(result.report) {
                result.report.fileName = fileName;
            }
            return result;
        });
};

let checkValidation = (email) => {
    console.log("coming soon");

    let findQuery = {
        email: email
    };


    var p = new Promise(function(resolve, reject) {
        dbHelper.dbClient.collection('static_list_emails_deliverables').findOne(findQuery,function(err, res) {
            if (err)
                reject(err);
            else
                resolve(res);
        });
    });

    return p;
};

module.exports = {
    start: startValidation,
    check: checkValidation
};