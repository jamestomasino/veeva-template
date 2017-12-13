"use strict"
// INCLUDE GULP
let gulp 			= require("gulp");

// INCLUDE PACKAGES
let concat 			= require("gulp-concat");
let del 			= require("del");
let minify_css 		= require("gulp-clean-css");
let order 			= require("gulp-order");
let plumber 		= require("gulp-plumber");
let sass 			= require("gulp-sass");
let util 			= require("gulp-util");
let imagemin 		= require('gulp-imagemin');
let changed 		= require('gulp-changed');

function bytesToSize(bytes) {
	let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return '0 Byte';
	let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 };

// PROCESS CSS
gulp.task("css", function (cb) {
	gulp.src("./src/scss/project.scss")
	.pipe(plumber())
	.pipe(sass().on('error', sass.logError))
	.pipe(minify_css({debug: true}, function(details) {
		if (details.errors.lenth > 0) {
			console.log(details.errors); // a list of errors raised
		} else {
			console.log(details.name + ' has 0 errors');
		}
		if (details.warnings.lenth > 0) {
			console.log(details.warnings); // a list of warnings raised
		} else {
			console.log(details.name + ' has 0 warnings');
		}
		console.log(details.name + ' original size: ' + bytesToSize(details.stats.originalSize)); // original content size after import inlining
		console.log(details.name + ' optimized size: ' + bytesToSize(details.stats.minifiedSize)); // optimized content size
		console.log(details.name + ' optimized in ' + details.stats.timeSpent + 'ms'); // time spent on optimizations in milliseconds
		console.log(details.name + ' efficiency: ' +  ~~((details.stats.efficiency) * 100).toFixed(2) + '%'); // a ratio of output size to input size (e.g. 25% if content was reduced from 100 bytes to 75 bytes)
	  }))
	.pipe(gulp.dest("./dist/css"))
});

// PROCESS JS
gulp.task("js", function () {
	gulp.src("./src/js/**/*" )
	.pipe(plumber())
	.pipe(order([
		"jquery.touchSwipe.min.js",
		"handlebars-v4.0.10.js",
		"TweenMax.min.js",
		"TimelineMax.min.js",
		"project.js",
		"help.js"
	]))
	.pipe(concat("project.js"))
	.pipe(gulp.dest("./dist/js"))
});

// COMPRESS IMAGES
gulp.task("imagemin", function() {
	gulp.src("./src/images/**/" )
	.pipe(plumber())
	.pipe(changed("./dist/images"))
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.jpegtran({progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({plugins: [{removeViewBox: true}]})
	], {
		verbose: true
	}))
	.pipe(gulp.dest("./dist/images"))
});

gulp.task('watch',function() {
	gulp.watch('./src/scss/**/*', ['css']);
	gulp.watch('./src/js/**/*', ['js']);
	gulp.watch('./src/images/**/', ['imagemin']);
});

gulp.task('default', ['css', 'js', 'imagemin']);
