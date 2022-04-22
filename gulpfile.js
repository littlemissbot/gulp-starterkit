/* file: gulpfile.js */

// include gulp
const { watch, series, parallel, src, dest } = require('gulp');

// include server plugins
var browserSync = require('browser-sync').create();

// include preprocessing plugins
var sass = require('gulp-sass'),
    concat = require('gulp-concat');
    // rename = require('gulp-rename'),
    // uglify = require('gulp-uglify');

// include templating plugins
var nunjucksRender = require('gulp-nunjucks-render'),
    data = require('gulp-data');

// fetching configurations
var fs = require('fs');
var fetchConfig = fs.readFileSync("gfconfig.json", "utf8")
const config = JSON.parse(fetchConfig);

// create a start task and log a message
function init(cb) {
    console.log("Initiating Gulp!");
    cb();
}

// compiling sass files
function sassCompile() {
    console.log("Compiling SASS Files!");
    return src(config.sass)
		.pipe(sass())
		.pipe(dest(config.dest.sass));
}

// compiling css files
function cssCompile() {
    console.log("Compiling CSS Files!");
    return src(config.styles)
		.pipe(concat('application.css'))
		.pipe(dest(config.dest.styles));
}

// compiling js files
function jsCompile() {
    console.log("Compiling JS Files!");
    return src(config.scripts)
		.pipe(concat('application.js'))
		.pipe(dest(config.dest.scripts));
}

// compiling nunjuck template files
function htmlCompile() {
    console.log("Compiling HTML Template Files!");
    return src(config.nunjucks)
        .pipe(data(function() {
            return require(config.data)
        }))
        .pipe(nunjucksRender({
            path: [config.nunjuck_templates]
        }))
		.pipe(dest(config.dest.html));
}

// optimize css and js files
function optimization(cb) {
    console.log("Optimizing APP Files!");
    cb();
}

// creating a server
function initServer() {
    console.log("Starting Browser Sync!");
    browserSync.init({
        server: config.dest.html
    });
}

// updating server files
function reloadServer(cb) {
    browserSync.reload();
    cb();
}

// compile source files
function compileSrc(cb) {
    series(sassCompile, cssCompile, jsCompile, htmlCompile);
    cb();
};

// recompile source files
function recompileSrc() {
    // watch for website content updates
    watch(`${config.dest.html}/*.html`, reloadServer)
    watch(`${config.dest.html}/*.css`, reloadServer)
    watch(`${config.dest.html}/*.js`, reloadServer)

    // watch for image asset updates
    watch(`${config.dest.images}/*.jpg`, reloadServer);
    watch(`${config.dest.images}/*.jpeg`, reloadServer);
    watch(`${config.dest.images}/*.png`, reloadServer);
    watch(`${config.dest.images}/*.gif`, reloadServer);
    watch(`${config.dest.images}/*.svg`, reloadServer);

    // watch for website raw content updates
    watch(config.sass, series(sassCompile, reloadServer));
    watch(config.styles, series(cssCompile, reloadServer));
    watch(config.scripts, series(jsCompile, reloadServer));
    watch(config.nunjucks, series(htmlCompile, reloadServer));
    watch(`${config.nunjuck_templates}/**/*.htm`, series(htmlCompile, reloadServer));
}

// ===========================
// gulp serve (for development)
exports.serve = series(init, compileSrc, optimization, parallel(initServer, recompileSrc))

// gulp build (for production)
exports.build = series(init, series(sassCompile, cssCompile, jsCompile, htmlCompile), optimization)

exports.default = series(init, series(sassCompile, cssCompile, jsCompile, htmlCompile), optimization)