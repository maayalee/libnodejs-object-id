/*jshint esnext: true */

var ObjectID = require('./ObjectID');

class ObjectIDBuilder {
  constructor(incrementCounter) {
    this._machineID = '';
    this._processID = 0;
    this._incrementCounter = incrementCounter;
  }

  static create(incrementCounter) {
    return new ObjectIDBuilder(incrementCounter);
  }


  machineID(id) {
    this._machineID = id;
    return this;
  }

  getMachineID() {
    return this._machineID;
  }

  processID(id) {
    this._processID = id;
    return this;
  }

  getProcessID() {
    return this._processID;
  }
  
  getIncrementCounter() {
    return this._incrementCounter;
  }

  build(print_debug) {
    return ObjectID.createWithBuilder(this, print_debug);
  }
}

module.exports = ObjectIDBuilder;