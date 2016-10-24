const gulp = require('gulp');
const babel = require('gulp-babel');
 
gulp.task('default', () => {
    return gulp.src('./Scenario.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./es5'));
});