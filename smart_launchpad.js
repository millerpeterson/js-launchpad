var _ = require('underscore');
var util = require('util');
var Launchpad = require('./launchpad.js').launchpad;
var events = require('events');

var SmartLaunchpad = function() {
  events.EventEmitter.call(this);
}

util.inherits(SmartLaunchpad, Launchpad);

SmartLaunchpad.prototype.setLed = function(row, col, color) {
};

SmartLaunchpad.prototype.draw = function() {
};

var smartLaunchpad = SmartLaunchpad;
module.exports.smartLaunchpad = smartLaunchpad;

