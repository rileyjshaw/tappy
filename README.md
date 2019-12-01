Tappy
=====

[![Build Status](https://travis-ci.org/rileyjshaw/tappy.svg?branch=master)](https://travis-ci.org/rileyjshaw/tappy)

A JavaScript library for recording and comparing rhythms. The project page lives [here](https://rileyshaw.com/tappy).

## Installation
Tappy can be installed using [npm](https://www.npmjs.org/package/tappy), [bower](http://bower.io/), or included from [jsdelivr](http://cdn.jsdelivr.net/tappy/latest/mainfile):
```bash
npm install tappy
```
```bash
bower install tappy
```
```html
<script src="//cdn.jsdelivr.net/tappy/latest/mainfile"></script>
```

The library uses a [universal module definition](https://github.com/umdjs/umd), so it _should_ work with whatever system you're using.

## Usage
For current docs, please visit [the project page](https://rileyjshaw.com/tappy).

## Contributing
Pull-requests to the `/app` and `/test` directories are welcome. Please create an [issue](https://github.com/rileyjshaw/tappy/issues) if you plan on adding features, as it might be better suited to a plugin.

Please squash changes down to a single commit before making a pull-request.

### Building the library
If you don't have [gulp](http://gulpjs.com/), you'll have to install it:
```bash
npm install -g gulp
```

After running
```bash
npm install
```
in the main directory, running
```bash
gulp
```
will watch the `/app` directory and build any changes to `/dist`. It also runs changes through `test/test.js`.

### Style
Pull requests _must_ adhere to the following code style guidelines, influenced heavily by [idiomatic.js](https://github.com/rwaldron/idiomatic.js/):

 - Put a space before the parens following `if ()`, `else if ()`, `for ()`, `while ()`, `try ()`, and `function ()` statements. Do not add padding spaces _within_ these parens.
 - Put a space between closing braces `)` and opening curly braces `{`.
 - Add padding spaces to curly braces that self-close on a single line: `var littleObject = { name: 'tiny' };`. Empty object literals do not require a space: `{}`.
 - Function definitions go at the top of their scope, followed immediately by `var`s.
 - If multiple lines are required for variable declarations, each new line should have its own `var` statement.
 - Indent using tabs. No trailing whitespace.
 - Line-length limit of 80 characters, with a tab-width of 4.
 - If statements have to be broken across lines, end lines with an operator:
```javascript
// example
var reallyReallyReallyLongLine = 'Zero Cool' + ', Acid Burn' + ', Lord Nikon' +
    	', The Phantom Phreak' + ', Cereal Killer' + ', The Plague' +
    	', that other kid...';
```
 - When aligning statements across lines, use spaces if alignment should be locked to a specific character length. in the previous example, four spaces were used _before_ the indenting tab to ensure tabs always started after `var `.
 - Gulp will automatically lint everything through jshint. Don't make it complain.

## Examples

###[Lyrics game](https://rileyjshaw.com/tappy-game)
A music game: tap the rhythm of the lyrics displayed.

###[Fingerprint](https://rileyjshaw.com/tappy-fingerprint)
A simple in-browser keystroke dynamics trainer.

___If you've built something with Tappy, let me know! I'd love to add it to this list.___

## License
Licensed under [MIT](https://github.com/rileyjshaw/tappy/blob/master/LICENSE). Created by [rileyjshaw](https://rileyjshaw.com/).
