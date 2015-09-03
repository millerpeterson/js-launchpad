var testHelper = require('./test_helper.js');
var launchpad = require('./../lib/launchpad.js');
var dummyMIDI = require('./../lib/dummy_midi_interface.js');
var assert = require('assert');
var util = require('util');
var _ = require('underscore');
var assertExpectedLoggedBytes =
  testHelper.assertExpectedLoggedBytes;

var lPad = new launchpad.output();
var dummyDevice = new dummyMIDI.midi();
lPad.init(dummyDevice);

suite('launchpad-output', function() {

  beforeEach(function() {
    lPad.resetDevice();
    lPad.midiInterface.clearLog();
  });

  test('setLed valid main grid 1', function() {
    lPad.setLed(3, 4, [0, 2], 'copy');
    assertExpectedLoggedBytes(lPad, [[144, 36, 44]]);
  });

  test('setLed valid main grid 2', function() {
    lPad.setLed(7, 7, [1, 1], 'update');
    assertExpectedLoggedBytes(lPad, [[144, 103, 17]]);
  });

  test('setLed valid main grid 3', function() {
    lPad.setLed(1, 7, [3, 0], 'flash');
    assertExpectedLoggedBytes(lPad, [[144, 7, 11]]);
  });

  test('setLed main grid no mode specified', function() {
    lPad.setLed(6, 0, [0, 0]);
    assertExpectedLoggedBytes(lPad, [[144, 80, 12]]);
  });

  test('setLed invalid args', function() {
    lPad.setLed(-10, 0, [3, 2]);
    assertExpectedLoggedBytes(lPad, []);
    lPad.setLed(4, 3, [3, 1222]);
    assertExpectedLoggedBytes(lPad, []);
  });

  test('autoFlash on', function() {
    lPad.autoFlash(true);
    assertExpectedLoggedBytes(lPad, [[176, 0, 40]]);
  });

  test('autoFlash off', function() {
    lPad.autoFlash(false);
    assertExpectedLoggedBytes(lPad, [[176, 0, 52]]);
  });

  test('resetDevice', function() {
    lPad.resetDevice();
    assertExpectedLoggedBytes(lPad, [
      [176, 0, 0], [176, 0, 49]
    ]);
  });

  test('setDisplayedBuffer 1', function() {
    lPad.setDisplayedBuffer(1);
    assertExpectedLoggedBytes(lPad, [[176, 0, 49]]);
  });

  test('setDisplayedBuffer 0', function() {
    lPad.setDisplayedBuffer(0);
    assertExpectedLoggedBytes(lPad, [[176, 0, 52]]);
  });

  test('swapBuffers', function() {
    assert.equal(lPad.displayedBuffer, 1);

    lPad.swapBuffers();
    assert.equal(lPad.displayedBuffer, 0);
    assertExpectedLoggedBytes(lPad, [[176, 0, 52]]);
    lPad.midiInterface.clearLog();

    lPad.swapBuffers();
    assert.equal(lPad.displayedBuffer, 1);
    assertExpectedLoggedBytes(lPad, [[176, 0, 49]]);
  });

  test('rapidUpdate', function() {
    var colors1 = [[1, 3], [2, 1]];
    var colors2 = [[1, 3], [2, 1], [1, 1]];
    var colors3 = [[2, 2], [3, 3], [0, 0], [0, 0]];
    _.each([colors1, colors2, colors3], function(c) {
      lPad.rapidUpdate(c);
    });
    assertExpectedLoggedBytes(lPad, [[146, 49, 18],
				     [146, 49, 18],
				     [146, 34, 51],
				     [146, 0, 0]]);
  });

  test('setDutyCycle', function() {
    var testDutyCycles = [[12, 5],
			  [2, 12],
			  [9, 18],
			  [14, 12]]
    _.each(testDutyCycles, function(dc) {
      lPad.setDutyCycle(dc[0], dc[1]);
    });
    assertExpectedLoggedBytes(lPad, [[176, 31, 50],
				     [176, 30, 25],
				     [176, 31, 15],
				     [176, 31, 89]]);
  });

});
