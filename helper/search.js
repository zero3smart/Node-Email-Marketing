/**
 * Created by titu on 11/10/16.
 */

const syntaxValidation = require('./validation/syntax');
const staticRemover = require('./validation/staticlistremover');
module.exports = {
    startSearch: (email) => {
        let header = {
            header: false,
            emailIndex: 0

        };
        let result = {
            data: [[email]],
            failed: false
        };

        return syntaxValidation.validate(result, header)
            .then((result) => {
                if (result && !result.data.length) {
                    result.failed = true;
                    return result;
                }
                result.email = result.data[0][0].toLowerCase();
                return staticRemover.search(result);
            });
    }
};