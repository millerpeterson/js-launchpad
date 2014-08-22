var assert = require('assert');
var util = require('util');
var _ = require('underscore');
var Buffer = require('./../buffer.js').buffer;

suite('buffer', function() {

  test('basic properties', function() {

    var b1 = new Buffer(9, 9);
    var b2 = new Buffer();
    
    var bufferProperties = function(b) {
      assert.equal(b.numRows, 9);
      assert.equal(b.numCols, 9);
      assert.equal(b.leds.length, 9);
      assert.equal(b.leds[0].length, 9);
      assert(b.leds[5][3].isEq([0, 0]));
      assert(b.led([8, 8]).isEq([0, 0]));
    };
    bufferProperties(b1);
    bufferProperties(b2);

  });

  test('single change diff', function() {    

    var b1 = new Buffer();
    var b2 = new Buffer();    
    var diff1, diff2;

    b2.setLed(5, 3, [1, 2]);
    diff1 = b2.diff(b1);
    diff2 = b1.diff(b2);
    assert.equal(diff1.nonBlackList().length, 1);
    assert.equal(diff2.nonBlackList().length, 1);
    assert(diff1.led([5, 3]).isEq([1, 2]));
    assert(diff2.led([5, 3]).isEq([-1, -2]));
 
  });

  test('successive changes in last row', function() {
  });

});


