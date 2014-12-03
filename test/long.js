var expect = require('chai').expect;
var tappy = require('../dist/tappy.min.js');

describe('Functional Tests', function () {
	this.timeout(60000);

	it('should call playback events at the right time', function (done) {
		function finished () {
			r2.done();
			expect(tappy.compare(r1, r2, true)).to.be.above(0.99);
			done();
		}

		var r1 = new tappy.Rhythm([800, 250, 1200, 900, 900, 1500, 450, 555]);
		var r2 = new tappy.Rhythm();

		r1.playback(r2.tap.bind(r2), finished);
	});

	it('should eliminate residual timing errors in playback', function (done) {
		function finished () {
			r2.done();
			// expect absolute diff of execution times to be < 4ms
			expect(Math.abs(r1.duration - r2.duration)).to.be.below(8);
			done();
		}

		// 55s total
		var intervals = [
			800, 250, 1200, 900, 900, 1500, 450, 555, 800, 250, 1200, 900, 900,
			1500, 800, 250, 1200, 900, 900, 450, 1500, 555, 800, 250, 1200, 900,
			900, 1500, 800, 250, 1200, 900, 900, 1500, 450, 555, 800, 250, 1200,
			900, 900, 1500, 650, 555, 800, 250, 1200, 900, 900, 1500, 450, 555,
			800, 850, 1200, 920, 900, 1500, 450, 555, 250, 1200, 900, 900, 500
		];
		var r1 = new tappy.Rhythm(intervals);
		var r2 = new tappy.Rhythm();

		r1.playback(r2.tap.bind(r2), finished);
	});
});
