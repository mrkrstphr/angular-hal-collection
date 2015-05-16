'use strict';

var args = require('yargs').argv,
  bump = require('gulp-bump'),
  gulp = require('gulp');

gulp.task('bump', function () {
  var config = {};

  if ('version' in args) {
    config.version = args.version;
  } else if ('type' in args) {
    config.type = args.type;
  }

  return gulp.src(['package.json', 'bower.json'])
    .pipe(bump(config))
    .pipe(gulp.dest('./'));
});
