var events = require('events');

// Dummy interface for testing.

DummyMIDIInterface.prototype = new events.EventEmitter();
DummyMIDIInterface.prototype.constructor = DummyMIDIInterface;

function DummyMIDIInterface() {};

DummyMIDIInterface.prototype.init = function() {
  this.loggedBytes = [];
}

DummyMIDIInterface.prototype.clearLog = function() {
  this.loggedBytes = [];
};

DummyMIDIInterface.prototype.sendBytes = function(bytes) {
  this.loggedBytes.push(bytes);
};

DummyMIDIInterface.prototype.bytesReceived = function(bytes) {
  this.emit('bytesReceived', bytes);
};

var dummyMIDI = DummyMIDIInterface;
module.exports.midi = dummyMIDI;