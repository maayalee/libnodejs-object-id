/*jshint esnext: true */
var buffer = require('buffer');
var CreateIDError = require('./CreateIDError');
/*
 * @class ID * @brief 여러 유형의 ID를 생성
 * 
 * @author Lee Hyeon-gi
 */
class ID {
  constructor() {
    this.incrementCount = 0;
    this.lastTimestamp = 0;
  }

  /**
      * 머신, 프로세스간 겹치지 않는 ID를 생성
   * 
   * Timestamp(8byte) + Shard id(Xbyte) + Increment count(2byte)
   * 
   * @param shard_id string 프로세스의 샤드 아이디. 샤드 아이디는 해당 프로세스의 겹치지 않는 고유 아이디로 중앙 관리서버에서
      *                                                발급해주는 방식으로 구현하거나 서버 시작시 고유한 shard_id 지정하여 시작할 수 있다.
   */
  generateID (shard_id, print_debug = false) {
    var stamp = new Date().getTime();
    if (stamp < this.lastTimestamp) {
      // 마지막 갱신 시간보다 현재 시간이 작으면 명백한 오류
      throw new CreateIDError(CreateIDError.TIMESTAMP_IS_BAKWORD);
    }
    if (stamp === this.lastTimestamp) {
      if (this.incrementCount >= 65535) {
        // 1ms당 2바이트로 할당된 증가 카운터 크기를 벗어나면 예외 발생(2^16)
        throw new CreateIDError(CreateIDError.INCREMENT_COUNT_OVERFLOW);
      }
    }
    else {
      this.incrementCount = 0;
    }
    this.incrementCount++;
    var count = this.incrementCount;
    this.lastTimestamp = stamp;

    var offset = 0;
    var buf = new Buffer(ID.TIME_STAMP_SIZE + shard_id.length + ID.INCREMENT_COUNT_SIZE);
    // timestamp
    buf.writeDoubleLE(stamp, 0);
    offset += ID.TIME_STAMP_SIZE;
    // shard id
    buf.write(shard_id, offset, shard_id.length, 'utf-8');
    offset += shard_id.length;
    // increment count
    buf.writeUInt16LE(count, offset);
    if (print_debug) {
      this._print_debug(buf, shard_id.length);
    }
    return buf.toString('hex');
  }

  _print_debug (buf, shard_id_length) {
    console.log("ID", 'ID::_print_debug::time stamp: ' + buf.readDoubleLE(0));
    console.log("ID", 'ID::_print_debug::shard id: ' + buf.toString('utf-8', ID.TIME_STAMP_SIZE, ID.TIME_STAMP_SIZE + shard_id_length));
    console.log("ID", 'ID::_print_debug::increment count: ' + buf.readUInt16LE(ID.TIME_STAMP_SIZE + shard_id_length));
    console.log("ID", 'ID::_print_debug::create id: ' + buf.toString('hex'));
  }

  static getInstance () {
    if (ID.instance == null) {
      ID.instance = new ID();
    }
    return ID.instance;
  }
}

ID.TIME_STAMP_SIZE = 8;
ID.INCREMENT_COUNT_SIZE = 2;

module.exports = ID;
