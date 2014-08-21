var _ = require('underscore');
var util = require('util');
var events = require('events');

var Launchpad = function() {
  events.EventEmitter.call(this);
};

util.inherits(Launchpad, events.EventEmitter);

Launchpad.prototype.init = function(midiInterface) {
  if (typeof(midiInterface) === 'undefined') {
    midiInterface = new midiInt.midi();
  };
  this.midiInterface = midiInterface;
  this.midiInterface.init();
  this.resetDevice();
  this.midiInterface.on('bytesReceived',
    _.bind(this.midiBytesReceived, this));
 }

Launchpad.prototype.emitButtonEvent = 
  function(midiVel, row, col) {
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

Launchpad.prototype.handleTopButtonPress = 
  function(ccVal, midiVel) {
    var row = 0;
    var col = ccVal - 104; // Leftmost is 104
    this.emitButtonEvent(midiVel, row, col);
  };

Launchpad.prototype.handleNonTopButtonPress = 
  function(noteVal, midiVel) {
    var row = Math.floor(noteVal / 16);
    // Shift row down because top buttons are considered a row
    row += 1;
    var col = noteVal % 16;
    this.emitButtonEvent(midiVel, row, col);
  };

Launchpad.prototype.cleanup = function() {
  this.midiInterface.cleanup();
};

Launchpad.prototype.resetDevice = function() {
  this.midiInterface.sendBytes([176, 0, 0]);
  this.setDisplayedBuffer(1);
};

Launchpad.prototype.validLedPos = function(row, col) {
  return ((row >= 0) && (row <= 9) &&
	  (col >= 0) && (col <= 9));
};

Launchpad.prototype.validColor = function(c) {
  var validComponent = function(c) {
    return ((c >= 0) && (c <= 3));
  };
  return _.isArray(c) && 
    validComponent(c[0]) &&
    validComponent(c[1]);
};

Launchpad.prototype.setLed = function(row, col, color, mode) {
  if (!(this.validLedPos(row, col) && 
	this.validColor(color))) {
    return;
  }
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
  outBytes = new Array(3);
  if (row == 0) { // Top row of buttons are sent as CC vals
    outBytes[0] = 176; // CC
    outBytes[1] = 104 + col;
  } else {
    outBytes[0] = 144; // Note
    outBytes[1] = ((row - 1) * 16) + col;
  }
  outBytes[2] = (green * 16) + red + setLedModeFlag;
  this.midiInterface.sendBytes(outBytes);
};

Launchpad.prototype.setDisplayedBuffer = function(bufferNum) {
  var outBytes = [176, 0, 0];
  outBytes[2] = (bufferNum == 1) ? 49 : 52;
  this.midiInterface.sendBytes(outBytes);
  this.displayedBuffer = bufferNum;
};

Launchpad.prototype.swapBuffers = function() {
  var newDisplayBuffer = (this.displayedBuffer == 1) ? 0 : 1;
  this.setDisplayedBuffer(newDisplayBuffer);
};

Launchpad.prototype.autoFlash = function(on) {
  var outBytes = [176, 0, 0];
  outBytes[2] = on ? 40 : 52;
  this.midiInterface.sendBytes(outBytes);
};

Launchpad.prototype.rapidUpdate = function(ledColors) {
  var colorByteValue;
  var closestEven = ledColors.length - (ledColors.length % 2);
  var numColors = Math.min(closestEven, 40); 
  // Convert to a list of [color, color] pairs, then iterate
  // through them, generating one MIDI message per pair.
  var pairs = _.reduce(_.range(0, numColors, 2), 
		       function(ps, i) {
			 ps.push([ledColors[i], 
				  ledColors[i + 1]]);
			 return ps;
		       }, []);  
  colorByteValue = function(color) {
    return (color[1] * 16) + color[0];
  };
  _.each(pairs, _.bind(function(pair) {
    if (_.every(pair, this.validColor)) {
      this.midiInterface.sendBytes([146,
				    colorByteValue(pair[0]),
				    colorByteValue(pair[1])]);
    }
  }, this));
};

Launchpad.prototype.setDutyCycle = function(num, denum) {
};

Launchpad.prototype.setBrightness = function(brightness) {
};

var launchpad = Launchpad;
module.exports.launchpad = launchpad;
