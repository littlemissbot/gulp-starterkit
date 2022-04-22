# Gulp Starterkit ![GitHub followers](https://img.shields.io/github/followers/littlemissbot.svg?style=social)
Automate and Enhance development environment using Gulp. 

![npm](https://img.shields.io/npm/v/gulp.svg?color=green) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/connect2samita/gulp-automation-v3.svg?color=green) ![GitHub All Releases](https://img.shields.io/github/downloads/connect2samita/gulp-automation-v3/total.svg) ![GitHub Release Date](https://img.shields.io/github/release-date/connect2samita/gulp-automation-v3.svg) ![GitHub](https://img.shields.io/github/license/connect2samita/gulp-automation-v3.svg)

### System Requirements
###### Check for Node and NPM
NodeJS - refer https://nodejs.org/en/ to install.
```
$ node --version
v14.15.1
```
NPM is a distribution of NodeJS, no separate installation required.
```
$ npm --version
7.5.4
```
Gulp CLI - refer https://gulpjs.com/docs/en/getting-started/quick-start to install
```
$ gulp --version
CLI version: 2.3.0
Local version: 4.0.2
```
###### NPM Packages Used
NPM package dependencies for development environment automation and enhancements.

![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/connect2samita/gulp-automation-v3/gulp.svg) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/connect2samita/gulp-automation-v3/gulp-sass.svg) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/connect2samita/gulp-automation-v3/gulp-nunjucks-render.svg) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/connect2samita/gulp-automation-v3/browser-sync.svg) 
```
"dependencies": {
    "browser-sync": "^2.27.9"
    "gulp": "^4.0.2"
    "gulp-concat": "^2.6.1"
    "gulp-data": "^1.3.1"
    "gulp-nunjucks-render": "^2.2.3"
    "gulp-rename": "^1.4.0"
    "gulp-sass": "^5.1.0"
    "gulp-uglify": "^3.0.2"
    "gulp-util": "^1.0.0"
 }
```

### Gulp Features
###### Gulp Tasks
1. Node server and browser/server reload on any file change.
3. Compile SASS files into CSS files.
4. Concat CSS files into one application.css file.
5. Concat JS files into one application.js file.
6. Nunjuck templating (using \*.htm) to render HTML templates.
7. Use data sets to generate dynamic content in nunjuck templates.
7. Minify CSS application.css to appplication.min.css file.
8. Minify JS application.js to application.min.js file.

###### Gulp Configuration File - gfconfig.json
Edit file to customise and design your own folder structure.
```
{
    "version": "1.0.0",
    "styles": [
        "src/assets/styles/application.css",
        "src/assets/styles/main.css"
    ],
    "scripts": [
        "src/assets/scripts/main.js"
    ],
    "images": [
        "src/assets/images/**/*.png",
        "src/assets/images/**/*.jpg",
        "src/assets/images/**/*.jpeg",
        "src/assets/images/**/*.gif",
        "src/assets/images/**/*.svg"
    ],
    "fonts": "src/assets/fonts",
    "sass": "src/assets/sass/**/*.scss",
    "nunjucks": "src/app/pages/**/*.htm",
    "nunjuck_templates": "src/app/partials",

    "data": "./src/data/sample1.json",

    "dest": {
        "html": "dist",
        "styles": "dist/css",
        "scripts": "dist/js",
        "images": "dist/img",
        "fonts": "dist/fonts",
        "sass": "src/assets/styles/"
    },
}
```

###### Gulpfile Tasks Definations - gulpfile.js
Edit file to update any gulp tasks to suit your needs
```
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
```

### Coming Soon
- Documentation to the startkit, and help you customise development environment to suit your needs.
- More features and tasks to power up development environment.
