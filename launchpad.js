var util = require('util');
var events = require('events');
var midiInt = require('./node_midi_interface');

function Launchpad() {
  events.EventEmitter.call(this);
};

util.inherits(Launchpad, events.EventEmitter);

Launchpad.prototype.init = function(midiInterface) {
  this.midiInterface = midiInterface;
  this.midiInterface.init();
  this.midiInterface.on('bytesReceived',
    this.midiBytesReceived.bind(this));
};

Launchpad.prototype.emitButtonEvent = function(midiVel, row, col) {
  var eventName = (midiVel == 127) ? 'press' : 'release';
  this.emit(eventName, row, col);
};

Launchpad.prototype.midiBytesReceived = function(bytes) {
  var midiCmd = bytes[0];
  var midiNoteOrCC = bytes[1];
  var midiVel = bytes[2];
  if (midiCmd == 144) { // Note
    this.handleNonTopButtonPress(midiNoteOrCC, midiVel);
  } else if (midiCmd == 176) { // CC
    this.handleTopButtonPress(midiNoteOrCC, midiVel);
  }
};

Launchpad.prototype.handleTopButtonPress = function(ccVal, midiVel) {
  var row = 0;
  var col = ccVal - 104; // Leftmost is 104
  this.emitButtonEvent(midiVel, row, col);
}

Launchpad.prototype.handleNonTopButtonPress = function(noteVal, midiVel) {
  var row = Math.floor(noteVal / 16);
  row += 1; // Shift row down because top buttons are considered a row
  var col = noteVal % 16;
  this.emitButtonEvent(midiVel, row, col);
}

Launchpad.prototype.cleanup = function() {
  this.midiInterface.cleanup();
}

var launchpad = Launchpad;
module.exports.launchpad = launchpad;

// var mInt = new midiInt.midi();
// var lPad = new Launchpad();
// lPad.init(mInt);
// lPad.on('press', function(row, col) {
//   console.log(util.format("press %d %d", row, col));
// })
// lPad.on('release', function(row, col) {
//   console.log(util.format("release %d %d", row, col));
// })