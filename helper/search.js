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
        let result = {data: [[email]]};

        return syntaxValidation.validate(result, header)
            .then((result) => {
                return staticRemover.start([result], header);
            });
    }
};