// incomplete coverage!
// TODO: playback
var expect = require('chai').expect;
var tappy = require('../dist/tappy.min.js');

describe('Tappy', function () {
	it('should have the proper API', function () {
		expect(tappy.average).to.be.a('function');
		expect(tappy.compare).to.be.a('function');
		expect(tappy.Rhythm).to.be.a('function');
	});

	it('should have chainable Rhythm methods', function () {
		var r = new tappy.Rhythm();
		expect(r, 'constructor').to.be.an.instanceOf(tappy.Rhythm);
		expect(r.tap(), 'tap').to.be.an.instanceOf(tappy.Rhythm);
		r.tap().tap();
		expect(r.done(), 'done').to.be.an.instanceOf(tappy.Rhythm);
		expect(r.playback(function () {}), 'playback').to.be.an.instanceOf(tappy.Rhythm);
	});

	it('should record proper lengths', function () {
		var r = new tappy.Rhythm();

		r.tap().tap().tap();
		expect(r).to.have.length(3);

		r.tap().tap().done();
		expect(r).to.have.length(5);

		r.length = 42;
		expect(r).to.have.length(5);
	});

	it('should not allow done() to be called with < 2 taps', function () {
		var r = new tappy.Rhythm();
		expect(r.done.bind(r), '0 taps').to.throw('less than 2 taps');

		r.tap();
		expect(r.done.bind(r), '1 tap').to.throw('less than 2 taps');

		r.tap();
		expect(r.done.bind(r), 'two taps').to.not.throw('less than 2 taps');
	});

	it('should not allow tap() to be called after done()', function () {
		var r = new tappy.Rhythm().tap();
		expect(r.tap.bind(r), 'before done').to.not.throw('after calling done()');
		expect(r.done().tap.bind(r), 'after done').to.throw('after calling done()');
	});

	it('should not generate value 0 in _taps[]', function () {
		function passArray () {
			var r = new tappy.Rhythm([7, 6, 5, 0]);
		}

		var r = new tappy.Rhythm();
		r.tap().tap().tap().tap().tap();
		expect(r._taps.some(function (tap) {
			return !tap;
		})).to.be.false;
	});

	it('should accept array in constructor', function () {
		function empty () {
			return new tappy.Rhythm([]);
		}

		function wrongType () {
			return new tappy.Rhythm(['a', 64, 27]);
		}

		function correct () {
			return new tappy.Rhythm([400, 300, 200, 300]);
		}

		expect(empty, 'empty').to.throw('array cannot be empty');
		expect(wrongType, 'wrongType').to.throw('array must only contain');
		expect(correct, 'correct').to.be.ok;
	});

	it('should return 1 from compare() for equal Rhythms', function () {
		var r1 = new tappy.Rhythm([6000, 4]);
		var r2 = new tappy.Rhythm([6000, 4]);

		expect(tappy.compare(r1, r2)).to.equal(1);
	});

	it('should treat batched average()s the same as intermediates', function () {
		var r1 = new tappy.Rhythm([600, 700, 500, 400]);
		var r2 = new tappy.Rhythm([620, 720, 480, 380]);
		var r3 = new tappy.Rhythm([580, 680, 520, 420]);

		// intermediate step
		var ra0 = tappy.average(r1, r2);

		var ra1 = tappy.average(ra0, r3);
		var ra2 = tappy.average(r1, r2, r3);

		expect(ra1).to.eql(ra2);
	});

	it('should not vary based on argument order in average()', function () {
		var r1 = new tappy.Rhythm([600, 700, 500, 400]);
		var r2 = new tappy.Rhythm([620, 720, 480, 380]);
		var r3 = new tappy.Rhythm([580, 680, 520, 420]);

		var ra1 = tappy.average(r1, r2, r3);
		var ra2 = tappy.average(r1, r3, r2);
		var ra3 = tappy.average(r2, r1, r3);
		var ra4 = tappy.average(r2, r3, r1);
		var ra5 = tappy.average(r3, r2, r1);
		var ra6 = tappy.average(r3, r1, r2);

		expect(tappy.compare(ra1, ra2), 'first').to.equal(1);
		expect(tappy.compare(ra1, ra3), 'second').to.equal(1);
		expect(tappy.compare(ra1, ra4), 'third').to.equal(1);
		expect(tappy.compare(ra1, ra5), 'fourth').to.equal(1);
		expect(tappy.compare(ra1, ra6), 'fifth').to.equal(1);
	});

	it('should average Rhythms as expected', function () {
		var r1 = new tappy.Rhythm([600, 700, 500, 400]);
		var r2 = new tappy.Rhythm([620, 720, 480, 380]);
		var r3 = new tappy.Rhythm([580, 680, 520, 420]);

		var ra = tappy.average(r1, r2, r3);

		expect(tappy.compare(r1, ra)).to.equal(1);
	});

	it('should not vary based on argument order in compare()', function () {
		var r1 = new tappy.Rhythm([1, 1800, 10E6, 18]);
		var r2 = new tappy.Rhythm([620, 1800, 720, 10E4]);

		var result1 = tappy.compare(r1, r2);
		var result2 = tappy.compare(r2, r1);

		expect(result1).to.equal(result2);
	});

	it('should be stringifiable', function () {
		var r = new tappy.Rhythm();
		var stringified = JSON.stringify(r);
		var raw = JSON.parse(stringified);
		expect(raw).to.not.be.an.instanceOf(tappy.Rhythm);
	});

	it('should recover stringified Rhythm objects', function () {
		function poorlyFormatted () {
			return new tappy.Rhythm({});
		}

		var r = new tappy.Rhythm().tap().tap().done();

		var stringified = JSON.stringify(r);
		var raw = JSON.parse(stringified);
		var recovered = new tappy.Rhythm(raw);

		expect(poorlyFormatted, 'poorly formatted').to.throw('poorly formatted');
		expect(recovered, 'recovered Rhythm').to.be.an.instanceOf(tappy.Rhythm);
		expect(recovered, 'recovered length').to.have.length(2);

		expect(tappy.compare(r, recovered), 'comparison').to.equal(1);
	});
});
