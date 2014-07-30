phi-launchpad-js
================

A Node.js interface for interacting with the Novation 
Launchpad.

phi-launchpad-js implements the [Launchpad MIDI spec](http://global.novationmusic.com/support/product-downloads?product=Launchpad, "Launchpad programmer's reference") 
allowing you to catch button presses and manipulate LEDs. 

## Setup

```
var phi = require('phi-launchpad.js');
var pad = new phi.Launchpad();
```

By default, the midi module is used for MIDI output, with the
output port being the one called 'Launchpad' (this can be
overriden; see below).

## Listening for button presses

```
pad.on('press', function(row, col) {
  console.log(util.format("press %d %d", row, col));
})

pad.on('release', function(row, col) {
  console.log(util.format("release %d %d", row, col));
})
```
