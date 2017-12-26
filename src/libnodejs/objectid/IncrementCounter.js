/*jshint esnext: true */
var crypto = require('crypto');
var buffer = require('buffer');
var CreateIDError = require('./CreateIDError');

class IncrementCounter {
  constructor() {
    this.incrementCount = 0;
    this.lastTimestamp = 0;
  }

  inc() {
    var stamp = Math.ceil(new Date().getTime() / 1000); //msec -> sec
    if (stamp < this.lastTimestamp) {
      // 마지막 갱신 시간보다 현재 시간이 작으면 명백한 오류
      throw new CreateIDError(CreateIDError.TIMESTAMP_IS_BAKWORD);
    } 
    if (stamp !== this.lastTimestamp) {
      this.incrementCount = 0;
    }
    this.incrementCount++;
    this.lastTimestamp = stamp;
    return this.incrementCount;
  }
  
  getIncrementCount() {
    return this.incrementCount;
  }
  
  getLastTimestamp() {
    return this.lastTimestamp;
  }
}

module.exports = IncrementCounter;