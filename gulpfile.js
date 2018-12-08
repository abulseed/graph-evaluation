var gulp = require("gulp");
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var gutil = require("gulp-util");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", ["compile"]);

gulp.task("compile", function () {
    return tsProject.src()
        .on('error', gutil.log)
        .pipe(sourcemaps.init())
        .on('error', gutil.log)
        .pipe(tsProject())
        .on('error', gutil.log)
        .js.pipe(sourcemaps.write('../maps'))
        .on('error', gutil.log)
        .pipe(gulp.dest("dist"))
        .on('error', gutil.log);
});

gulp.watch([
    "src/*.ts",
    "src/**/*.ts"
], ["compile"]);
