/* file: gulpfile.js */

// include gulp
var gulp = require('gulp'),
    gutil = require('gulp-util');

// include server plugins
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');

// include preprocessing plugins
var sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify');

// include templating plugins
var nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data');

// fetching configurations
var fs = require('fs');
var fetchConfig = fs.readFileSync("gfconfig.json", "utf8")
const config = JSON.parse(fetchConfig);

// create a start task and log a message
gulp.task('init', function() {
    gutil.log('Initiating Gulp!');
});

// compiling sass files
gulp.task('sass-compile', function() {
    gutil.log('Compiling SASS Files!');
    return gulp.src(config.sass)
		.pipe(sass())
		.pipe(gulp.dest(config.dest.sass));
});

// compiling css files
gulp.task('css-compile', function() {
    gutil.log('Compiling CSS Files!');
    return gulp.src(config.styles)
        .pipe(concat('application.css'))
        .pipe(gulp.dest(config.dest.styles));
});

// compiling js files
gulp.task('js-compile', function() {
    gutil.log('Compiling JS Files!');
    return gulp.src(config.scripts)
        .pipe(concat('application.js'))
        .pipe(gulp.dest(config.dest.scripts));
});

// compiling nunjuck template files
gulp.task('html-compile', function() {
    gutil.log('Compiling HTML Template Files!');
    return gulp.src(config.nunjucks)
    .pipe(data(function() {
        return require(config.data)
      }))
    .pipe(nunjucksRender({
        path: [config.nunjuck_templates]
      }))
    .pipe(gulp.dest(config.dest.html))
});

// optimize css and js files
gulp.task('optimization', function() {
    gutil.log('Optimizing APP Files!');
})

// creating a server
gulp.task('init-server', function() {
    gutil.log('Starting Browser Sync!');
    browserSync.init({
        server: config.dest.html
    });
});

// updating server files
gulp.task('reload-server', function() {
    // watch for website content updates
    gulp.watch(`${config.dest.html}/*.html`).on('change', browserSync.reload);
    gulp.watch(`${config.dest.styles}/*.css`).on('change', browserSync.reload);
    gulp.watch(`${config.dest.scripts}/*.js`).on('change', browserSync.reload);

    // watch for image asset updates
    gulp.watch(`${config.dest.images}/*.jpg`).on('change', browserSync.reload);
    gulp.watch(`${config.dest.images}/*.jpeg`).on('change', browserSync.reload);
    gulp.watch(`${config.dest.images}/*.png`).on('change', browserSync.reload);
    gulp.watch(`${config.dest.images}/*.gif`).on('change', browserSync.reload);
    gulp.watch(`${config.dest.images}/*.svg`).on('change', browserSync.reload);
});

// compile source files
gulp.task('compile-src', function() {
    runSequence(['sass-compile', 'css-compile', 'js-compile', 'html-compile']);
});

// recompile source files
gulp.task('recompile-src', function() {
    // watch for website content updates
    gulp.watch(config.sass, ['sass-compile']);
    gulp.watch(config.styles, ['css-compile']);
    gulp.watch(config.scripts, ['js-compile']);
    gulp.watch(config.nunjucks, ['html-compile']);
    gulp.watch(`${config.nunjuck_templates}/**/*.htm`, ['html-compile']);
});

// ===========================
// gulp serve (for development)
gulp.task('serve', function() {
    runSequence(['init', 'compile-src', 'init-server', 'reload-server', 'recompile-src']);
});

// gulp build (for production)
gulp.task('build', function() {
    runSequence(['init', 'compile-src', 'optimization']);
});