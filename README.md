plaunchpad
==========

A Node.js interface for interacting with the Novation Launchpad.

plaunchpad implements the [Launchpad MIDI spec](http://global.novationmusic.com/support/product-downloads?product=Launchpad, "Launchpad programmer's reference") 
allowing you to catch button presses and manipulate LEDs.

## Installation

The [midi](https://github.com/justinlatimer/node-midi) package 
is used for output; note its requirements.

Install via npm:

```
$ npm install plaunchpad
```

## Usage

### Setup

```Javascript
var plaunchpad = require('plaunchpad');
var lpadIn = new plaunchpad.input();
var lpadOut = new plaunchpad.output();

```

### Listening for button presses

```Javascript
lpadIn.on('press', function(row, col) {
  console.log(util.format("press %d %d", row, col));
});

lpadIn.on('release', function(row, col) {
  console.log(util.format("release %d %d", row, col));
});

```

### Setting LEDs

```Javascript
lpadOut.setLed(3, 4, [0, 3]);

Set the LED in row 3, column 4, to be the color with red = 0
(no red) and green = 3 (full green). Calls with arguments out 
of range either in position or color are ignored.
```

### Buffered Updates

The Launchpad is double-buffered; it has one showing buffer, 
and another that is hidden. To reduce flicker while updating
large portions of the Launchpad, you can send updates to the
hidden buffer, then swap the two buffers to show all of the 
changes immediately.

```Javascript
# Send a number of updates to the hidden buffer:
lpadOut.setLed(5, 6, [2, 2], 'update');
lpadOut.setLed(3, 4, [0, 2], 'update');
lpadOut.setLed(5, 7, [2, 0], 'update');

# Show all changes at once:
lpadOut.swapBuffers();
```

### Rapid Updates

### Adjusting Brightness

plaunchpad addresses the Launchpad as a 9x9 matrix with a 
"hole" in the upper rightmost element.

### MIDI device name

To use a Launchpad with a MIDI device name other than
"Launchpad" (the default if unspecified), you can do the following:

```Javascript
var midiInt = require('./node_midi_interface').midi;
var m = new midiInt(/Your Device Name/);
lpadIn = new plaunchpad.input(m);
lpadOut = new plaunchpad.outpu(m);
```