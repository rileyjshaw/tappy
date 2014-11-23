var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: false});
var source = require('vinyl-source-stream');
var browserify = require('browserify');

var argv = require('minimist')(process.argv.slice(2));

var paths = {
  scripts: {
    entry: './app/js/main.js',
    all: './app/**/*.js'
  },
  static: './web/static/**/*',
  stylesheets: './web/sass/**/*.sass',
  dist: './dist',
  webDist: './web_dist'
};

gulp.task('lint', function () {
  return gulp.src(paths.scripts.all)
    .pipe($.jshint())
    .pipe($.jshint.reporter('default'));
});

gulp.task('scripts', ['lint'], function () {
  return browserify(paths.scripts.entry)
    .bundle()
    .pipe(source('tappy.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe($.rename('tappy.min.js'))
    .pipe($.streamify( $.uglify() ))
    .pipe(gulp.dest(paths.dist))
});

gulp.task('sass', function () {
  return gulp.src(paths.stylesheets)
    .pipe($.rubySass())
    .pipe($.autoprefixer())
    .pipe(gulp.dest(paths.static))
});

gulp.task('web', ['sass'], function () {
  return gulp.src(paths.static)
    .pipe(gulp.dest(paths.webDist))
});

gulp.task('watch', function () {
  gulp.watch([paths.scripts.all], ['lint', 'scripts']);
  gulp.watch([paths.stylesheets, paths.static], ['web']);
});

gulp.task('deploy', function () {
  gulp.src(paths.webDist + '/**/*')
    .pipe($.ghPages('https://github.com/rileyjshaw/tappy.git', 'origin'));
});

gulp.task('webserver', function () {
  gulp.src(paths.webDist)
    .pipe($.webserver({
      host: '0.0.0.0',
      livereload: true,
      open: true
    }));
});

gulp.task( 'default', [ 'lint', 'scripts', 'sass', 'web', 'webserver', 'watch' ] );