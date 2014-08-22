var assert = require('assert');

function assertExpectedLoggedBytes(lPad, expectedBytes) {
  var actualBytes = lPad.midiInterface.loggedBytes;
  assert.equal(actualBytes.length, expectedBytes.length);
  for (var i = 0; i < expectedBytes.length; i++) {
    for (var j = 0; j < expectedBytes[i].length; j++) {
      assert.equal(actualBytes[i][j], expectedBytes[i][j]);
    }
  }
}

module.exports.assertExpectedLoggedBytes = 
  assertExpectedLoggedBytes;
