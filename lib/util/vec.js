var func = require('./func.js');
var _ = require('underscore');

var convertToArray = function(arrayOrVec) {
  if (!_.isArray(arrayOrVec)) {
    // Assume arrayOrVec is a Vec.
    return arrayOrVec.val();
  }
  return arrayOrVec;
};

var Vec = function(v) {
  if (typeof(v) === 'undefined') {
    v = [0, 0];
  }
  this.val = function() {
    return v;
  }
}

Vec.method('add', function(right) {
  right = convertToArray(right);
  var sum;
  var left = this.val();
  sum = new Vec([left[0] + right[0],
                 left[1] + right[1]]);
  return sum;
});

Vec.method('sub', function(right) {
  right = convertToArray(right);
  var diff;
  var left = this.val();
  diff = new Vec([left[0] - right[0],
                  left[1] - right[1]]);
  return diff;
});

Vec.method('isEq', function(other) {
  other = convertToArray(other);
  var v = this.val();
  return ((v[0] === other[0]) &&
          (v[1] === other[1]));
});

var vec = Vec;
module.exports.vec = vec;
