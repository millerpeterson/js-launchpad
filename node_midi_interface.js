var util = require('util');
var events = require('events');
var midi = require('midi');

function NodeMIDIInterface() {
  events.EventEmitter.call(this);
};

util.inherits(NodeMIDIInterface, events.EventEmitter);

NodeMIDIInterface.prototype.nodeMidiMessageReceived = function(deltaTime, message) {
  this.bytesReceived(message);
};

NodeMIDIInterface.prototype.init = function() {
  this.input = new midi.input();
  this.output = new midi.output();
  this.portRegex = /Launchpad/;
  this.input.openPort(this.findPort(this.input));
  this.output.openPort(this.findPort(this.output));
  this.input.on('message',
    this.nodeMidiMessageReceived.bind(this));
};

NodeMIDIInterface.prototype.findPort = function(inOrOut) {
  for (var i = 0; i < inOrOut.getPortCount(); i++) {
    if (this.portRegex.test(inOrOut.getPortName(i))) {
      return i;
    }
  }
};

NodeMIDIInterface.prototype.bytesReceived = function(bytes) {
  this.emit('bytesReceived', bytes);
};

NodeMIDIInterface.prototype.sendBytes = function(bytes) {
  this.output.sendMessage(bytes);
};

NodeMIDIInterface.prototype.cleanup = function(bytes) {
  this.input.closePort();
}

var nodeMidi = NodeMIDIInterface;
module.exports.midi = nodeMidi;