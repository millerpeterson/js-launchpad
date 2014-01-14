var _ = require('underscore');
var util = require('util');
var events = require('events');
var midiInt = require('./node_midi_interface');

var Launchpad = function() {
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
};

Launchpad.prototype.handleNonTopButtonPress = function(noteVal, midiVel) {
  var row = Math.floor(noteVal / 16);
  row += 1; // Shift row down because top buttons are considered a row
  var col = noteVal % 16;
  this.emitButtonEvent(midiVel, row, col);
};

Launchpad.prototype.cleanup = function() {
  this.midiInterface.cleanup();
};

// var isValidSetLedArgs = function(row, col, red, green, mode) {
//   return (
//     (row >= 0) && (row <= 8) &&
//     (col >= 0) && (col <= 8) &&
//     !((row == 8) && (col == 8)) &&
//     (red >= 0) && (red <= 3) &&
//     (green >= 0) && (green <= 3) &&
//     (_.contains(_.keys(setLedModes), mode))
//   )
// }

Launchpad.prototype.setLed = function(row, col, color, mode) {
  var red = color[0];
  var green = color[1];
  if (typeof(mode) === 'undefined') {
    mode = 'copy';
  }
  var setLedModeFlag = {
    'copy': 12,
    'update': 8,
    'flash': 0
  }[mode];
//  if !(isValidSetLedArgs)
  outBytes = new Array(3);
  if (row == 0) {
    outBytes[0] = 176; // CC
    outBytes[1] = 104 + col;
  } else {
    outBytes[0] = 144; // Note
    outBytes[1] = ((row - 1) * 16) + col;
  }
  outBytes[2] = (green * 16) + red + setLedModeFlag;
  this.midiInterface.sendBytes(outBytes);
};

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