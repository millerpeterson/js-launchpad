phi-launchpad
=============

A Node.js interface for interacting with the Novation 
Launchpad.

phi-launchpad implements the [Launchpad MIDI spec](http://global.novationmusic.com/support/product-downloads?product=Launchpad, "Launchpad programmer's reference") 
allowing you to catch button presses and manipulate LEDs.

## Installation

The [midi](https://github.com/justinlatimer/node-midi) package 
is used for output; note its requirements.

Install via npm:

```
$ npm install phi-launchpad
```

## Usage

### Setup

```
var phi = require('phi-launchpad.js');
var pad = new phi.Launchpad();
```

### Listening for button presses

```
pad.on('press', function(row, col) {
  console.log(util.format("press %d %d", row, col));
})

pad.on('release', function(row, col) {
  console.log(util.format("release %d %d", row, col));
})
```
