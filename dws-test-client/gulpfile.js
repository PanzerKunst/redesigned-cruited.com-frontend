// ## Imports
var del = require("del");
var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var eslint = require("gulp-eslint");
var minifyCss = require("gulp-minify-css");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var mainBowerFiles = require("main-bower-files");
var runSequence = require("run-sequence");
var streamSeries = require("stream-series");
var wiredep = require("wiredep");

// ## Settings
var srcDir = "assets/";
var scriptSrcDir = srcDir + "scripts/";
var styleSrcDir = srcDir + "styles/";

var scriptSrcFiles = scriptSrcDir + "**/*";
var styleSrcFiles = styleSrcDir + "**/*";
var styleMainSrcFiles = styleSrcDir + "main.scss";

var distDir = "public/";
var scriptDistDir = distDir + "scripts/";
var styleDistDir = distDir + "styles/";

var srcScriptsDistFileName = "app.js";
var srcScriptsDistFilePath = scriptDistDir + srcScriptsDistFileName;
var scriptsDistFileName = "main.js";


// ## Gulp tasks
// Run `gulp -T` for a task summary

// ### Styles
// `gulp styles` - Compiles, combines, and optimizes Bower CSS and project CSS.
gulp.task("styles", ["wiredep"], function() {
    gulp.src(styleMainSrcFiles)
        .pipe(sourcemaps.init())
        .pipe(sass({"style": "compressed"})
            .on("error", function(err) {
                console.error(err.message);
                this.emit("end");
            }))
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(styleDistDir));
});

// ### Scripts
// `gulp scripts` - Merges all lib files with app.js, into distDir
// and project JS.
gulp.task("scripts", ["react"], function() {
    return streamSeries(
        gulp.src(mainBowerFiles({filter: /.*\.js$/i})),
        gulp.src(srcScriptsDistFilePath))
        .pipe(concat(scriptsDistFileName))
        .pipe(gulp.dest(scriptDistDir));
});

// ### React
// `gulp react` - Compiles React JSX
gulp.task("react", ["lint"], function() {
    return gulp.src(scriptSrcFiles)
        .pipe(babel())
        .pipe(concat(srcScriptsDistFileName))
        .pipe(gulp.dest(scriptDistDir));
});

gulp.task("cleanSrcScriptsDistFile", function() {
    return del(srcScriptsDistFilePath);
});

// ### ESLint
// `gulp lint` - Lints project JS.
gulp.task("lint", function() {
    return gulp.src(scriptSrcFiles)
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError());
});

// ### Clean
// `gulp clean` - Deletes the build folder entirely.
gulp.task("clean", function() {
    return del(distDir);
});

// ### Watch
// `gulp watch` - Use BrowserSync to proxy your dev server and synchronize code
// changes across devices. Specify the hostname of your dev server at
// `manifest.config.devUrl`. When a modification is made to an asset, run the
// build step for that asset and inject the changes into the page.
// See: http://www.browsersync.io
gulp.task("watch", function() {
    gulp.watch([styleSrcFiles], ["styles"]);
    gulp.watch([scriptSrcFiles], ["scripts"]);
    gulp.watch(["bower.json"], ["build"]);
});

// ### Build
// `gulp build` - Run all the build tasks but don't clean up beforehand.
// Generally you should be running `gulp` instead of `gulp build`.
gulp.task("build", function(callback) {
    runSequence("styles",
        "scripts",
        "cleanSrcScriptsDistFile",
        callback);
});

// ### Wiredep
// `gulp wiredep` - Automatically inject Less and Sass Bower dependencies. See
// https://github.com/taptapship/wiredep
gulp.task("wiredep", function() {
    return gulp.src(styleMainSrcFiles)
        .pipe(wiredep.stream())
        .pipe(gulp.dest(styleSrcDir));
});

// ### Gulp
// `gulp` - Run a complete build. To compile for production run `gulp --production`.
gulp.task("default", ["clean"], function() {
    gulp.start("build");
});
