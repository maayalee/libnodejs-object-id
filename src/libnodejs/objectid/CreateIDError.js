function CreateIDError(error_code) {
  Logic_Error.call(this, 'Create id failed:error code: ' + error_code);
}

CreateIDError.TIMESTAMP_IS_BAKWORD = 1;
CreateIDError.INCREMENT_COUNT_OVERFLOW = 2;

CreateIDError.prototype = new Error('');
CreateIDError.prototype.constructor = CreateIDError;

module.exports = CreateIDError;
