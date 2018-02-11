/**
 * I found the recipe for this gulpfile here:
 * https://hackernoon.com/how-to-set-up-a-postcss-pipeline-with-variable-sharing-in-gulp-4e77624cc749
 */
var gulp = require("gulp")
var postcss = require("gulp-postcss")
var partialImport = require("postcss-partial-import")
var cssnext = require("postcss-cssnext")
var gutil = require('gulp-util')
var cp = require('child_process');

gulp.task('eleventy', function(cb) {
    cp.exec('eleventy', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })
})

gulp.task('eleventy:watch', function() {
    var eleventy = cp.spawn('eleventy', ['--watch']);

    const eleventyLogger = function(buffer) {
        buffer.toString()
              .split(/\n/)
              .forEach((message) => gutil.log('Eleventy: ' + message));
    };

    eleventy.stdout.on('data', eleventyLogger);
    eleventy.stderr.on('data', eleventyLogger);
})

gulp.task("css", function () {
    var processors = [
        partialImport(),
        cssnext({
            browsers: ["> 1%"],
        })
    ]
    return gulp.src("./css/style.css")
        .pipe(postcss(processors)).on('error', gutil.log)
        .pipe(gulp.dest("./_site/css"))
})

gulp.task('css:watch', function() {
    gulp.watch("./css/**/*.css", ["css"])
})

gulp.task('manifest', function() {
    return gulp.src(['./manifest.json', './pwabuilder-sw.js'])
        .pipe(gulp.dest('./_site'));
})

gulp.task('build', ['css', 'eleventy', 'manifest']);

gulp.task("default", ['css', 'eleventy:watch', 'css:watch'])