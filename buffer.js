var _ = require('underscore');
var util = require('util');
var func = require('./util/func.js');
var $V = require('./util/vec.js').vec;

var Buffer = function(numRows, numCols) {
  if ((typeof(numRows) === 'undefined') || 
      (typeof(numCols) === 'undefined')) {
    numRows = 9;
    numCols = 9;
  };	
  var r, c;
  this.numRows = numRows;
  this.numCols = numCols;
  this.leds = [];
  for (r = 0; r < this.numRows; r++) {
    this.leds[r] = []
    for (c = 0; c < this.numCols; c++) {
      this.leds[r][c] = new $V([0, 0]);
    }
  }
};

Buffer.method('validPos', function(r, c) {
  return ((r >= 0) && (r <= this.numRows) && 
	  (c >= 0) && (c <= this.numCols));
});

Buffer.method('led', function(rc) {
  return this.leds[rc[0]][rc[1]];
});

Buffer.method('setLed', function(row, col, color) {
  if (_.isArray(color)) {
    color = new $V(color);
  };
  this.leds[row][col] = color;
});

Buffer.method('diff', function(otherBuffer) {
  var diffBuffer = new Buffer(this.numRows, this.numCols);
  this.rowColEach(function(r, c, l) {
    var otherLed;
    if (otherBuffer.validPos(r, c)) {
      otherLed = otherBuffer.leds[r][c];
      diffBuffer.setLed(r, c, l.sub(otherLed));
    }
  });
  return diffBuffer;
});

Buffer.method('nonBlackList', function() {
  return _.filter(this.rowColList(), _.bind(function(rc) {
    return !(this.led(rc).isEq([0, 0]));
  }, this));
});

Buffer.method('rowColList', function() {
  var r, c;
  var list = [];
  for (r = 0; r < this.numRows; r++) {
    for (c = 0; c < this.numCols; c++) {
      list.push([r, c]);
    }
  }
  return list;
});

Buffer.method('rowColEach', function(f) {
  _.each(this.rowColList(), _.bind(function(rc) { 
    f(rc[0], rc[1], this.led(rc)); 
  }, this));
});

var buffer = Buffer;
module.exports.buffer = buffer;
