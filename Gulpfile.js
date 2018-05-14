var gulp = require('gulp')
var sass = require('gulp-sass')

gulp.task('watch', function() {
  gulp.src('src/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('src'))
})

//Watch task
gulp.task('default',function() {
  gulp.watch('src/**/*.scss',['watch']);
})
