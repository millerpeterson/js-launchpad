var util = require('util');
var events = require('events');
var midiInt = require('./node_midi_interface').midi;

util.inherits(LaunchpadIn, events.EventEmitter);

var LaunchpadIn = function(midiInterface) {
  if (typeof(midiInterface) === 'undefined') {
    midiInterface = new midiInt();
  };
  events.EventEmitter.call(this);
  this.midiInterface = midiInterface;
  this.midiInterface.init();
  this.midiInterface.on('bytesReceived',
    _.bind(this.midiBytesReceived, this));
};

LaunchpadIn.method('cleanup', function() {
  this.midiInterface.cleanup();
});

LaunchpadIn.method('emitButtonEvent', function(midiVel, row, col) {
  var eventName = (midiVel == 127) ? 
    'press' : 'release';
  this.emit(eventName, row, col);
});

LaunchpadIn.method('midiBytesReceived', function(bytes) {
  var midiCmd = bytes[0];
  var midiNoteOrCC = bytes[1];
  var midiVel = bytes[2];
  if (midiCmd == 144) { // Note
    this.handleNonTopButtonPress(midiNoteOrCC, midiVel);
  } else if (midiCmd == 176) { // CC
    this.handleTopButtonPress(midiNoteOrCC, midiVel);
  }
});

LaunchpadIn.method('handleTopButtonPress', function(ccVal, midiVel) {
  var row = 0;
  var col = ccVal - 104; // Leftmost is 104
  this.emitButtonEvent(midiVel, row, col);
});

LaunchpadIn.method('handleNonTopButtonPress', function(noteVal, midiVel) {
  var row = Math.floor(noteVal / 16);
  // Shift row down because top buttons are considered a row
  row += 1;
  var col = noteVal % 16;
  this.emitButtonEvent(midiVel, row, col);
});

var launchpadIn = LaunchpadIn;
module.exports.launchpadIn = launchpadIn;
