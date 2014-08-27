var launchpad = require('./../lib/launchpad.js')
var dummyMIDI = require('./../lib/dummy_midi_interface.js')
var assert = require('assert');
var _ = require('underscore');

var lPad = new launchpad.input();
lPad.init(new dummyMIDI.midi());

function testButtonClick(midiBytes, rowExpect, colExpect, done) {
  var pressEventFired = false;
  lPad.on('press', function(row, col) {
    assert.equal(row, rowExpect);
    assert.equal(col, colExpect);
    assert.equal(pressEventFired, false);
    pressEventFired = true;
  });
  lPad.on('release', function(row, col) {
    assert.equal(row, rowExpect);
    assert.equal(col, colExpect);
    assert.equal(pressEventFired, true);
    done();
  });
  _.each(midiBytes, function(bytes) {
    lPad.midiInterface.bytesReceived(bytes);
  });
}

suite('launchpad-input', function() {

  beforeEach(function() {
    lPad.removeAllListeners('press');
    lPad.removeAllListeners('release');
  });

  _.each(_.range(8), function(col) {
    test('topButtonPress' + col, function(done) {
      bytes = [[176, 104 + col, 127], [176, 104 + col, 0]];
      testButtonClick(bytes, 0, col, done);
    });
  });

  _.each(_.range(8), function(row) {
    _.each(_.range(9), function(col) {
      var v = (row * 16) + col;
      test('nonTopButtonPress' + v, function(done) {
        bytes = [[144, v, 127], [144, v, 0]];
        testButtonClick(bytes, row + 1, col, done);
      });
    });
  });

});
