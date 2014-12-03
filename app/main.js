var now = require('right-now');

// helper function for reduce()
function sum (a, b) { return a + b; }

function compare (r1, r2, inelastic) {
	var error, multiplier, length, dur1, dur2, rHi, rLo;

	if (typeof r1._tap === 'number' || typeof r2._tap === 'number') {
		throw new Error('Can\'t compare Rhythms before calling done()');
	}

	length = r1.length;
	if (length !== r2.length) return false;
	length--;

	r1 = r1._taps;
	r2 = r2._taps;

	if (!inelastic) {
		dur1 = r1.reduce(function (acc, tap) { return acc + tap; });
		dur2 = r2.reduce(function (acc, tap) { return acc + tap; });

		if (dur1 > dur2) {
			rHi = r1;
			rLo = r2;
		} else {
			rHi = r2;
			rLo = r1;
		}

		// calculate the multiplier
		multiplier = rHi.map(function (tHi, i) {
			var tLo = rLo[i];
			return tLo / tHi;
		}).reduce(function (acc, ratio) {
			return acc + ratio;
		}) / length;

		// normalize rHi
		rHi = rHi.map(function (tap) {
			return tap * multiplier;
		});
	} else {
		rHi = r1;
		rLo = r2;
	}

	// 1 - mean absolute error normalized to [0, 1]
	return 1 - rHi.reduce(function (acc, tap1, i) {
		var tap2 = rLo[i];
		var tHi = Math.max(tap1, tap2);
		var tLo = Math.min(tap1, tap2);

		return acc + (tHi - tLo) / tHi;
	}, 0) / length;
}

function average () {
	var args = Array.prototype.slice.call(arguments);
	var r0, w0, length, duration, taps, weight;

	if (args.some(function (a) { return typeof a._tap === 'number'; })) {
		throw new Error('Can\'t combine Rhythms before calling done()');
	}

	weight = args.reduce(function (acc, r) {
		return acc + r._weight;
	}, 0);

	r0 = args.shift();
	length = r0.length;

	if (args.some(function (a) { return a.length !== length; })) {
		throw new Error('Can\'t combine Rhythms of different lengths');
	}

	w0 = r0._weight;

	taps = r0._taps.map(function (tap0, i) {
		return (tap0 * w0 + args.reduce(function (acc, r) {
			return acc + r._taps[i] * r._weight;
		}, 0)) / weight;
	});

	return Object.freeze(new Rhythm({
		length: length,
		duration: taps.reduce(sum),
		_taps: taps,
		_weight: weight
	}));
}

function Rhythm (obj) {
	// checks null and undefined
	if (obj == null) {
		this.length   = 0;
		this.duration = 0;
		this._prevTap = 0;
		this._curTap  = 0;
		this._taps    = [];
		this._weight  = 1;
	} else if (obj.constructor === Array) {
		if (!obj.length) {
			throw new Error('Rhythm array cannot be empty');
		}
		if (obj.some(function (c) { return typeof c !== 'number' || !c; })) {
			throw new Error('Rhythm array must only contain non-zero numbers');
		}

		this.length   = obj.length + 1;
		this.duration = obj.reduce(sum);
		this._taps    = obj;
		this._weight  = 1;
		Object.freeze(this);
	} else {
		if (!obj.hasOwnProperty('length')  ||
		    !obj.hasOwnProperty('_taps')   ||
		    !obj.hasOwnProperty('_weight') ||
		    !obj.hasOwnProperty('duration')) {
			throw new Error('Object passed to Rhythm is poorly formatted');
		}

		this.length   = obj.length;
		this.duration = obj.duration;
		this._taps    = obj._taps;
		this._weight  = obj._weight;
		Object.freeze(this);
	}
}

Rhythm.prototype.tap = function tappy_tap () {
	var interval, prevTap, curTap = this._curTap;

	if (typeof curTap === 'undefined') {
		throw new Error('Can\'t call tap() after calling done()');
	}

	prevTap = this._prevTap = curTap;
	curTap = this._curTap = now();

	if (prevTap) {
		interval = (curTap - prevTap) || 1;
		this._taps.push(interval);
		this.duration += interval;
	}

	this.length++;
	return this;
};

Rhythm.prototype.done = function tappy_done () {
	if (this.length < 2) {
		throw new Error('Can\'t call done() with less than 2 taps');
	}

	delete this._curTap;
	delete this._prevTap;
	delete this._nextTap;
	Object.freeze(this);

	return this;
};

Rhythm.prototype.playback = function tappy_playback (cb, done, multiplier) {
	function nextCb () {
		var diff, next = taps.pop();

		cb(i++);

		// no fear of typecasting errors since intervals must be > 0
		if (next) {
			// actual elapsed minus expected elapsed
			diff = now() - start - elapsed;
			setTimeout(nextCb, next - diff);
			elapsed += next;
		} else if (typeof done === 'function') done();
	}

	var i, length, taps, start, elapsed;

	if (typeof this._curTap === 'number') {
		throw new Error('Can\'t call playback() before calling done()');
	}

	i = elapsed = 0;
	length = this.length;
	taps = this._taps.slice().reverse();

	if (multiplier)
		taps = taps.map(function (tap) { return tap * multiplier; });

	start = now();
	nextCb();
	return this;
};

module.exports = {
	compare: compare,
	average: average,
	Rhythm: Rhythm
};
