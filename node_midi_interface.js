var util = require('util');
var events = require('events');
var midi = require('midi');
var _ = require('underscore');

function NodeMIDIInterface() {
  events.EventEmitter.call(this);
};

util.inherits(NodeMIDIInterface, events.EventEmitter);

NodeMIDIInterface.prototype.nodeMidiMessageReceived = function(deltaTime, message) {
  this.bytesReceived(message);
};

NodeMIDIInterface.prototype.init = function(portRegex) {
  this.input = new midi.input();
  this.output = new midi.output();
  if (typeof(portRegex === 'undefined')) {
    portRegex = /Launchpad/;
  }
  this.portRegex = portRegex;
  var inputPortNum = this.findPort(this.input);
  if (inputPortNum >= 0) {
    this.input.openPort(inputPortNum);
  }
  var outputPortNum = this.findPort(this.output);
  if (outputPortNum >= 0) {
    this.output.openPort(outputPortNum);
  }
  this.input.on('message',
    this.nodeMidiMessageReceived.bind(this));
};

NodeMIDIInterface.prototype.findPort = function(inOrOut) {
  for (var i = 0; i < inOrOut.getPortCount(); i++) {
    if (this.portRegex.test(inOrOut.getPortName(i))) {
      return i;
    }
  }
  return -1;
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