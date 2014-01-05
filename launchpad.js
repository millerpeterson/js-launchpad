var util = require('util');
var events = require('events');
var midiInt = require('./node_midi_interface');

function Launchpad() {
  events.EventEmitter.call(this);
};

util.inherits(Launchpad, events.EventEmitter);

Launchpad.prototype.midiBytesReceived = function(bytes) {
  var midiCmd = bytes[0];
  var midiNoteOrCC = bytes[1];
  var midiVel = bytes[2];
  if (!this.includeVelocity && (midiVel == 0)) {
    return;
  }
  if (midiCmd == 144) { // Note
    this.handleNonTopButtonPress(midiNoteOrCC, midiVel);
  } else if (midiCmd == 176) { // CC
    this.handleTopButtonPress(midiNoteOrCC, midiVel);
  }
};

Launchpad.prototype.handleTopButtonPress = function(ccVal, midiVel) {
  console.log('handleTopButtonPress: ' + ccVal + ' ' + midiVel);
}

Launchpad.prototype.handleNonTopButtonPress = function(noteVal, midiVel) {
  console.log('handleNonTopButtonPress: ' + noteVal + ' ' + midiVel);
}

Launchpad.prototype.init = function(midiInterface) {
  this.includeVelocity = true;
  this.midiInterface = midiInterface;
  this.midiInterface.init();
  this.midiInterface.on('bytesReceived',
    this.midiBytesReceived.bind(this));
};

Launchpad.prototype.cleanup = function() {
  this.midiInterface.cleanup();
}

var launchpad = Launchpad;
module.exports.launchpad = launchpad;

var mInt = new midiInt.midi();
var lPad = new Launchpad()
lPad.init(mInt);