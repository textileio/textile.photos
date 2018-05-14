var gulp = require('gulp')
var sass = require('gulp-sass')
var useref = require('gulp-useref')
var uglify = require('gulp-uglify')
var gulpIf = require('gulp-if')
var cssnano = require('gulp-cssnano')
var cache = require('gulp-cache')
var imagemin = require('gulp-imagemin')
var browserSync = require('browser-sync').create()
var runSequence = require('run-sequence')
var del = require('del')

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('watch', function() {
  gulp.src('src/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('src'))
})

//Watch task
gulp.task('default',function() {
  gulp.watch('src/**/*.scss',['watch']);
})

gulp.task('useref', function(){
  return gulp.src('src/**/*.+(html|js|css|json)')
      .pipe(useref())
      .pipe(gulpIf('*.js', uglify()))
      // Minifies only if it's a CSS file
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'))
});

// gulp.task('sass', function() {
//   return gulp.src('src/**/*.scss') // Gets all files ending with .scss in app/scss
//       .pipe(sass())
//       .pipe(gulp.dest('dist'))
// });

gulp.task('sass', function() {
  return gulp.src('src/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
      .pipe(sass())
      .pipe(gulp.dest('src'))
})

gulp.task('images', function(){
  return gulp.src('src/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
      .pipe(cache(imagemin({
        interlaced: true
      })))
      .pipe(gulp.dest('dist/'))
})

gulp.task('fonts', function() {
  return gulp.src('src/statics/fonts/**/*')
      .pipe(gulp.dest('dist/statics/fonts'))
})

gulp.task('build', function (callback) {
  runSequence('clean:dist',
      ['sass', 'useref', 'images', 'fonts'],
      callback
  )
})