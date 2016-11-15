/**
 * Created by titu on 11/14/16.
 */

const _ = require('lodash');
const settings = require('../config/settings');
const commonHelper = require('./common');
const promise = require('bluebird');
const zipHelper = require('./zip');

let saveReports = (results, directory, header) => {

    let cleanDirectory = directory + '/' + settings.cleanDirectory + '/';

    return promise.map(results, function (result) {
        if(!result.report.saveReports) {
            return;
        }
        else {
            let fileName = result.report.fileName;
            let fileExtension = commonHelper.getFileExtension(fileName).toLowerCase();
            let fileNameWithoutExtension = fileName.split('.')[0];
            let handler = commonHelper.geFileHandler(fileExtension);
            let delimiter = null;
            return promise.map(result.report.saveReports, function (reportToSave) {

                var data = _.map(reportToSave.data, function (d) {
                    return [d];
                });
                //write the report files
                return handler.save(data, cleanDirectory, (reportToSave.reportName + '_' + fileNameWithoutExtension), false, delimiter);
            })
                .then(() => {
                    //write the clean file
                    return handler.save(result.data, cleanDirectory, ('CLEANED_' + fileNameWithoutExtension), header, delimiter);
                });
        }
    })
        .then(() => {
            return zipHelper.zip(cleanDirectory, new Date().getTime().toString() + '.zip', 'zip');
        })
        .then(() => {
            return results;
        });

};

module.exports = {
    saveReports: saveReports
};
