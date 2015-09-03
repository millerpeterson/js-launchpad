var _ = require('underscore');
var func = require('./util/func');
var bScale = require('./brightness');

var LaunchpadOut = function() {
  this.brightnessScale = bScale.scale();
};

LaunchpadOut.method('init', function(midiInterface) {
  this.midiInterface = midiInterface;
  this.midiInterface.init();
  this.resetDevice();
  this.displayedBuffer = 1;
});

LaunchpadOut.method('cleanup', function() {
  this.midiInterface.cleanup();
});;

LaunchpadOut.method('resetDevice', function() {
  this.midiInterface.sendBytes([176, 0, 0]);
  this.setDisplayedBuffer(1);
});

LaunchpadOut.method('validLedPos', function(row, col) {
  return ((row >= 0) && (row <= 9) &&
	  (col >= 0) && (col <= 9));
});

LaunchpadOut.method('validColor', function(c) {
  var validComponent = function(c) {
    return ((c >= 0) && (c <= 3));
  };
  return _.isArray(c) &&
    validComponent(c[0]) &&
    validComponent(c[1]);
});

LaunchpadOut.method('setLed', function(row, col, color, mode) {
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
    'update': 0,
    'flash': 8
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
});

LaunchpadOut.method('setDisplayedBuffer', function(bufferNum) {
  var outBytes = [176, 0, 0];
  outBytes[2] = (bufferNum == 1) ? 49 : 52;
  this.midiInterface.sendBytes(outBytes);
  this.displayedBuffer = bufferNum;
});

LaunchpadOut.method('swapBuffers', function() {
  var newDisplayBuffer = (this.displayedBuffer == 1) ? 0 : 1;
  this.setDisplayedBuffer(newDisplayBuffer);
});

LaunchpadOut.method('autoFlash', function(on) {
  var outBytes = [176, 0, 0];
  outBytes[2] = on ? 40 : 52;
  this.midiInterface.sendBytes(outBytes);
});

LaunchpadOut.method('rapidUpdate', function(ledColors) {
  var colorByteValue;
  var closestEven = ledColors.length - (ledColors.length % 2);
  var numColors = Math.min(closestEven, 40);
  // Convert to a list of [color, color] pairs, then iterate
  // through them, generating one MIDI message per pair.
  var pairs = _.reduce(_.range(0, numColors, 2),
		       function(ps, i) {
			       ps.push([ledColors[i], ledColors[i + 1]]);
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
});

LaunchpadOut.method('validDutyCycle', function(num, denom) {
  return ((num >= 1) && (num <= 16) &&
	  (denom >= 3) && (denom <= 18));
});

LaunchpadOut.method('setDutyCycle', function(num, denom) {
  if (!this.validDutyCycle(num, denom)) {
    return;
  }
  var outBytes = [176, 0, 0];
  if (num < 9) {
    outBytes[1] = 30;
    outBytes[2] = (16 * (num - 1)) + (denom - 3);
  } else {
    outBytes[1] = 31;
    outBytes[2] = (16 * (num - 9)) + (denom - 3);
  }
  this.midiInterface.sendBytes(outBytes);
});

LaunchpadOut.method('setBrightness', function(brightness) {
  if (!((brightness >= 0) &&
        (brightness <= this.brightnessScale.length))) {
    return;
  }
  var bVals = this.brightnessScale[brightness];
  this.setDutyCycle(bVals[0], bVals[1]);
});

var launchpadOut = LaunchpadOut;
module.exports.launchpadOut = launchpadOut;
