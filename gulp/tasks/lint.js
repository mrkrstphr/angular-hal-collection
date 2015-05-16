'use strict';

var config = require('../config'),
  gulp = require('gulp'),
  jshint = require('gulp-jshint');

gulp.task('lint', function() {
  var src = [
    config.src + '/*.js',
    '!' + config.src + '/*-test.js'
  ];

  return gulp.src(src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
