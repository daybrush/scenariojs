const gulp = require('gulp');
const babel = require('gulp-babel');
var jsdoc = require("gulp-jsdoc");


gulp.task('default', () => {
    return gulp.src('./Scenario.js')	
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./es5'));
});

gulp.task('jsdoc', () => {
    return gulp.src(["./Scenario.js", "README.md"])
  .pipe(jsdoc.parser())
  .pipe(jsdoc.generator('./doc'))
});