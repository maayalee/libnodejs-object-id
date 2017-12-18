/*jshint esnext: true */
class CreateIDError extends Error {
  constructor(error_code) {
    super('Create id failed:error code: ' + error_code);
  }
}

CreateIDError.TIMESTAMP_IS_BAKWORD = 1;
CreateIDError.INCREMENT_COUNT_OVERFLOW = 2;

module.exports = CreateIDError;
