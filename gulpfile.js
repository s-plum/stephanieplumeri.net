var gulp = require('gulp'),
	connect = require('gulp-connect'),
	ejs = require('gulp-ejs'),
	wrap = require('gulp-wrap'),
	rename = require('gulp-rename'),
	tap = require('gulp-tap'),
	path = require('path'),
	gulpif = require('gulp-if'),
	compass = require('gulp-compass'),
	plumber = require('gulp-plumber'),
  imagemin = require('gulp-imagemin'),
  uglify = require('gulp-uglify'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  pageData = require('./build/json/data.json'),
  onError = function (err) {  
    console.log(err.toString());
  };

var viewnames = [];

gulp.task('html', ['getviews'], function() {
	viewnames.forEach(function(name, index) {
		gulp.src('./build/views/partials/' + name + '.ejs')
			.pipe(ejs(pageData[name]).on('error', onError))
			.pipe(wrap({ src: './build/views/layout.ejs'}, pageData[name]))
			.pipe(rename('index.html'))
			.pipe(gulpif(name == 'index', gulp.dest('./dist')))
			.pipe(gulpif(name != 'index', gulp.dest('./dist/' + name)))
			.pipe(connect.reload());
	});
});

gulp.task('getviews', function() {
	return gulp.src('./build/views/partials/**/*.ejs')
		.pipe(tap(function(file) {
			viewnames.push(path.basename(file.path).split('.')[0]);
		}));
});

gulp.task('watch', function() {
	gulp.watch('./build/views/**/*.ejs', ['html']);
	gulp.watch('./build/css/src/**/*.scss', ['sassy']);
  gulp.watch('./build/js/**/*.js', ['scripts']);
});

gulp.task('sassy', function() {
  gulp.src('./build/css/src/**/*.scss')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(compass({
      config_file: './config.rb',
      css: './build/css',
      sass: './build/css/src',
      sourcemap: true
    }))
    .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());
});

gulp.task('sassymap', function() {
  gulp.src('./build/css/src/**/*.scss')
    .pipe(gulp.dest('./dist/css/src'));
  gulp.src('./build/css/*.map')
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  gulp.src('./build/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'))
});

gulp.task('otherAssets', function() {
  gulp.src('./build/docs/**/*.pdf')
    .pipe(gulp.dest('./dist/docs'));
  gulp.src(['./build/audio/**/*.mp3', './build/audio/**/.ogg'])
    .pipe(gulp.dest('./dist/audio'));
});

gulp.task('scripts', function() {
  gulp.src(['./build/js/jeesh.min.js', './build/js/draggable.js', './build/js/plumbox.js', './build/js/main.js'])
    .pipe(concat('main.js', {newLine: ';'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
    .pipe(connect.reload());
});

gulp.task('server', function() { 
  connect.server({
    root: './dist',
    port: 4242,
    livereload: true
  })
});

gulp.task('default', ['html', 'sassy', 'sassymap', 'images', 'scripts', 'otherAssets', 'watch', 'server']);