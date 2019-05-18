# Gulp Automation v3 ![GitHub followers](https://img.shields.io/github/followers/connect2samita.svg?style=social)
Automate and Enhance development environment using Gulp v3. 

![npm](https://img.shields.io/npm/v/gulp.svg?color=green) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/connect2samita/gulp-automation-v3.svg?color=green) ![GitHub All Releases](https://img.shields.io/github/downloads/connect2samita/gulp-automation-v3/total.svg) ![GitHub Release Date](https://img.shields.io/github/release-date/connect2samita/gulp-automation-v3.svg) ![GitHub](https://img.shields.io/github/license/connect2samita/gulp-automation-v3.svg)

### System Requirements
###### Check for Node and NPM
NodeJS - refer https://nodejs.org/en/ to install.
```
$ node --version
v10.15.3
```
NPM is a distribution of NodeJS, no separate installation required.
```
$ npm --version
6.9.0
```
###### NPM Packages Used
NPM package dependencies for development environment automation and enhancements.

![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/connect2samita/gulp-automation-v3/gulp.svg) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/connect2samita/gulp-automation-v3/gulp-sass.svg) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/connect2samita/gulp-automation-v3/gulp-nunjucks-render.svg) ![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/connect2samita/gulp-automation-v3/browser-sync.svg) 
```
"dependencies": {
    "browser-sync": "^2.26.3"
    "gulp": "^3.9.0"
    "gulp-concat": "^2.6.1"
    "gulp-data": "^1.3.1"
    "gulp-nunjucks-render": "^2.2.3"
    "gulp-rename": "^1.4.0"
    "gulp-sass": "^4.0.2"
    "gulp-uglify": "^3.0.2"
    "gulp-util": "^3.0.8"
    "run-sequence": "^2.2.1"
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

// TODO: optimize css and js files
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
```

### Coming Soon
- Documentation to the startkit, and help you customise development environment to suit your needs.
- More features and tasks to power up development environment.
