let gulp = require('gulp')
let concat = require('gulp-concat')
let minifyCSS = require('gulp-clean-css')
let order = require('gulp-order')
let plumber = require('gulp-plumber')
let sass = require('gulp-sass')(require('sass'))
let imagemin = require('gulp-imagemin')
let changed = require('gulp-changed')

function bytesToSize (bytes) {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

// PROCESS CSS
gulp.task('css', function () {
  return gulp.src('./src/scss/project.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS({ debug: true }, function (details) {
      if (details.errors.lenth > 0) {
        console.log(details.errors)
      } else {
        console.log(details.name + ' has 0 errors')
      }
      if (details.warnings.lenth > 0) {
        console.log(details.warnings)
      } else {
        console.log(details.name + ' has 0 warnings')
      }
      console.log(details.name + ' original size: ' + bytesToSize(details.stats.originalSize))
      console.log(details.name + ' optimized size: ' + bytesToSize(details.stats.minifiedSize))
      console.log(details.name + ' optimized in ' + details.stats.timeSpent + 'ms')
      console.log(details.name + ' efficiency: ' + ~~((details.stats.efficiency) * 100).toFixed(2) + '%')
    }))
    .pipe(gulp.dest('./dist/css'))
})

// PROCESS JS
gulp.task('js', function () {
  return gulp.src('./src/js/**/*')
    .pipe(plumber())
    .pipe(order([
      'jquery.touchSwipe.min.js',
      'handlebars-v4.0.10.js',
      'TweenMax.min.js',
      'TimelineMax.min.js',
      'project.js',
      'help.js'
    ]))
    .pipe(concat('project.js'))
    .pipe(gulp.dest('./dist/js'))
})

// COMPRESS IMAGES
gulp.task('imagemin', function () {
  return gulp.src('./src/images/**/*')
    .pipe(plumber())
    .pipe(changed('./dist/images'))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({ plugins: [{ removeViewBox: true }] })
    ], {
      verbose: true
    }))
    .pipe(gulp.dest('./dist/images'))
})

gulp.task('watch', function () {
  gulp.watch('./src/scss/**/*', gulp.parallel('css'))
  gulp.watch('./src/js/**/*', gulp.parallel('js'))
  gulp.watch('./src/images/**/', gulp.parallel('imagemin'))
})

gulp.task('default', gulp.parallel('css', 'js', 'imagemin'))
