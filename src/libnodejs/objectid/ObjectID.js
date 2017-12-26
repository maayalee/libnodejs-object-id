/*jshint esnext: true */
var crypto = require('crypto');
var buffer = require('buffer');
var CreateIDError = require('./CreateIDError');
/*
 * @class ObjectID 
 * @brief 여러 유형의 ObjectID를 생성
 * 
 * @author Lee Hyeon-gi
 */
class ObjectID {
  constructor() {
    this._buf = null;
  }
  
  static createWithBuilder(builder, printDebug = false) {
    var machineID = builder.getMachineID();
    var processID = builder.getProcessID();
    
    var instance = new ObjectID();
    if (0 === machineID.length) {
      machineID = process.getuid().toString();
    }
    if (0 === processID) {
      processID = process.pid;
    }
    instance.generate(builder.getIncrementCounter(), machineID, processID, printDebug);
    return instance;
  }

  /**
      * 머신, 프로세스간 겹치지 않는 ObjectID를 생성
   * 
   * Timestamp(4byte) + Machine ID(3byte) + ProcessID(2byte) + Increment count(2byte)
   * 
   */
  generate(counter, machineID, processID, printDebug = false) {
    var count = counter.inc();
    if (this.incrementCount >= ObjectID.MAX_INCREMENT_COUNT_PER_SEC) {
      // 1ms당 2바이트로 할당된 증가 카운터 크기를 벗어나면 예외 발생(2^16)
      throw new CreateIDError(CreateIDError.INCREMENT_COUNT_OVERFLOW);
    }
    var offset = 0;
    this._buf = new Buffer(ObjectID.TIME_STAMP_SIZE + ObjectID.MACHINE_ID_SIZE + ObjectID.PROCESS_ID_SIZE + ObjectID.INCREMENT_COUNT_SIZE);
    // timestamp
    this._buf.writeUInt32LE(counter.getLastTimestamp(), 0);
    offset += ObjectID.TIME_STAMP_SIZE;
    // machine id
    var hash = crypto.createHash('md5').update(machineID).digest('hex');
    this._buf.write(hash, offset, ObjectID.MACHINE_ID_SIZE, 'utf-8');
    offset += ObjectID.MACHINE_ID_SIZE;
    // process id 
    this._buf.writeUInt16LE(processID, offset);
    offset += ObjectID.PROCESS_ID_SIZE;
    // increment count
    this._buf.writeUInt16LE(count, offset);
    if (printDebug) {
      this._printDebug();
    }
  }

  _printDebug () {
    var offset = 0;
    console.log('ObjectID::_printDebug::time stamp: ' + this._buf.readUInt32LE(0));
    offset += ObjectID.TIME_STAMP_SIZE;
    console.log('ObjectID::_printDebug::machine id: ' + this._buf.toString('utf-8', offset, offset + ObjectID.MACHINE_ID_SIZE));
    offset += ObjectID.MACHINE_ID_SIZE;
    console.log('ObjectID::_printDebug::process id: ' + this._buf.readUInt16LE(offset));
    offset += ObjectID.PROCESS_ID_SIZE;
    console.log('ObjectID::_printDebug::increment count: ' + this._buf.readUInt16LE(offset));
    console.log('ObjectID::_printDebug::create id: ' + this.toString());
  } 
  
  toString() {
    return this._buf.toString('hex');
  }
}

ObjectID.TIME_STAMP_SIZE = 4;
ObjectID.MACHINE_ID_SIZE = 3;
ObjectID.PROCESS_ID_SIZE = 3;
ObjectID.INCREMENT_COUNT_SIZE = 2;
ObjectID.MAX_INCREMENT_COUNT_PER_SEC = 65535;

module.exports = ObjectID;
