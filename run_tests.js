var ObjectID = require('./src/libnodejs/objectid/ObjectID');
var ObjectIDBuilder = require('./src/libnodejs/objectid/ObjectIDBuilder');
var IncrementCounter = require('./src/libnodejs/objectid/IncrementCounter');

var counter = new IncrementCounter();
console.log(ObjectIDBuilder.create(counter).machineID('test-shard-id').processID(14000).build(true).toString());
console.log(ObjectIDBuilder.create(counter).machineID('test-shard-id').build(true).toString());
console.log(ObjectIDBuilder.create(counter).machineID('test-shard-id').build(true).toString());
console.log(ObjectIDBuilder.create(counter).machineID('test-shard-id2').build(true).toString());
console.log(ObjectIDBuilder.create(counter).build(true).toString());

setTimeout(function() {
  console.log(ObjectIDBuilder.create(counter).machineID('test-shard-id').build(true).toString());
}, 1000);