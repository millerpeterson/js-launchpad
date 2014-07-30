var launchpad = require('./../launchpad.js');
var dummyMIDI = require('./../dummy_midi_interface.js');
var assert = require('assert');
var util = require('util');
var _ = require('underscore');

function assertExpectedLoggedBytes(lPad, expectedBytes) {
  var actualBytes = lPad.midiInterface.loggedBytes;
  assert.equal(actualBytes.length, expectedBytes.length);
  for (var i = 0; i < expectedBytes.length; i++) {
    for (var j = 0; j < expectedBytes[i].length; j++) {
      assert.equal(actualBytes[i][j], expectedBytes[i][j]);
    }
  }
}

var lPad = new launchpad.launchpad()
lPad.init(new dummyMIDI.midi());

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
    assertExpectedLoggedBytes(lPad, [[144, 103, 25]]);
  });

  test('setLed valid main grid 3', function() {
    lPad.setLed(1, 7, [3, 0], 'flash');
    assertExpectedLoggedBytes(lPad, [[144, 7, 3]]);
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

});
