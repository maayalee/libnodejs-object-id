/*jshint esnext: true */
var crypto = require('crypto');
var buffer = require('buffer');
var CreateIDError = require('./CreateIDError');

class IncrementCounter {
  constructor() {
    this._incrementCount = 0;
    this._lastTimestamp = 0;
  }

  inc() {
    var stamp = Math.ceil(new Date().getTime() / 1000); //msec -> sec
    if (stamp < this._lastTimestamp) {
      // 마지막 갱신 시간보다 현재 시간이 작으면 명백한 오류
      throw new CreateIDError(CreateIDError.TIMESTAMP_IS_BAKWORD);
    } 
    if (stamp !== this._lastTimestamp) {
      this._incrementCount = 0;
    }
    this._incrementCount++;
    this._lastTimestamp = stamp;
    return this._incrementCount;
  }
  
  getIncrementCount() {
    return this._incrementCount;
  }
  
  getLastTimestamp() {
    return this._lastTimestamp;
  }
}

module.exports = IncrementCounter;