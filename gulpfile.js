var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./sass/main.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/*.scss', ['sass']);
});