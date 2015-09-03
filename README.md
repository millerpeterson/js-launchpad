phi-launchpad
==========

A Node.js interface for interacting with the Novation Launchpad.

phi-launchpad implements the [Launchpad MIDI spec](http://global.novationmusic.com/support/product-downloads?product=Launchpad, "Launchpad programmer's reference")
allowing you to catch button presses and manipulate LEDs.

## Installation

Install via npm:

```
$ npm install phi-launchpad
```

## Usage

### Setup

Connect to MIDI:

```Javascript
var plaunchpad = require('phi-launchpad');

var lpadIn = new plaunchpad.input();
lpadIn.init();

var lpadOut = new plaunchpad.output();
lpadOut.init();
```

MIDI device is configurable; see below.

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
lpadOut.setLed(4, 2, [2, 2]);
lpadOut.setLed(0, 0, [2, 0]);
lpadOut.setLed(8, 8, [3, 3]);
```

Set the LED in row 3, column 4, to be the color with red = 0
la(no red) and green = 3 (full green). Calls with arguments out
of range either in position or color are ignored.

plaunchpad addresses the Launchpad as a 9x9 matrix with a
"hole" in the upper rightmost element.

Colors are represented as red/green pairs: [0..3,0..3]

### Buffered Updates

The Launchpad is double-buffered; it has one showing buffer,
and another that is hidden. To reduce flicker while updating
large portions of the Launchpad, you can send updates to the
hidden buffer, then swap the two buffers to show all of the
changes immediately.

Send a number of updates to the hidden buffer:

```Javascript
lpadOut.setLed(5, 6, [2, 2], 'update');
lpadOut.setLed(3, 4, [0, 2], 'update');
lpadOut.setLed(5, 7, [2, 0], 'update');
```

Show all changes at once:
```Javascript
lpadOut.swapBuffers();
```

### Rapid Updates

You can update large parts of the Launchpad with fewer MIDI messages
using the rapid update function. Pass in a list of up to 80 red/green
pairs as a flat array:

```JavaScript
lpadOut.rapidUpdate(2, 3, 4, 2, 0 ... 3, 2);
lpadOut.swapBuffers();
```

Note that swapBuffers() needs to be called for the update to show.

### Autoflash

Set some LEDs with the 'flash' flag:

```Javascript
lpadOut.setLed(2, 5, [2, 2], 'flash');
```

Then turn on autoflash to see them blink at a set rate:

```Javascript
lpadOut.autoFlash(true);
```

Pass false to autoFlash to stop the blinking.

```Javascript
lpadOut.autoFlash(false);
```

### Adjusting Brightness

Set brightness as a single value (0 - 255):
```Javacript
lpadOut.setBrightness(64);
```

Set brightness as duty cycle (numerator, denominator):
```Javascript
lpadOut.setDutyCycle(1, 8);
```

### MIDI device name

To use a Launchpad with a MIDI device name other than
"Launchpad" (the default if unspecified), you can do the following:

```Javascript
var midiInt = require('./node_midi_interface').midi;
var m = new midiInt(/Your Device Name/);

var lpadIn = new plaunchpad.input();
lpadIn.init(m);

lpadOut = new plaunchpad.output();
lpadOut.init(m);
```
