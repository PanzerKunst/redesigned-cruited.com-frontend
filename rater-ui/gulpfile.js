// ## Imports
var del = require("del");
var gulp = require("gulp");
var cleanCss = require("gulp-clean-css");
var concat = require("gulp-concat");
var eslint = require("gulp-eslint");
var imagemin = require("gulp-imagemin");
var postcss = require("gulp-postcss");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var reporter = require("postcss-reporter");
var syntaxScss = require("postcss-scss");
var pump = require("pump");
var runSequence = require("run-sequence");
var streamSeries = require("stream-series");
var stylelint = require("stylelint");
var webpack = require("webpack");
var webpackStream = require("webpack-stream");

// ## Settings
var srcDir = "assets/";
var scriptSrcDir = srcDir + "scripts/";
var styleSrcDir = srcDir + "styles/";
var imageSrcDir = srcDir + "images/";
var fontSrcDir = srcDir + "fonts/";

var scriptSrcFiles = scriptSrcDir + "**/*";
var styleSrcFiles = styleSrcDir + "**/*";
var imageSrcFiles = imageSrcDir + "**/*";
var fontSrcFiles = fontSrcDir + "**/*";
var styleMainSrcFiles = styleSrcDir + "main.scss";

var vendorDir = "vendor/";
var scriptVendorFiles = vendorDir + "**/*";

var distDir = "public/";
var scriptDistDir = distDir + "scripts/";
var imageDistDir = distDir + "images/";
var fontDistDir = distDir + "fonts/";

var scriptDistFileNameConcat = "libs.js";

// ## Gulp tasks
// Run `gulp -T` for a task summary

// ### Styles
// `gulp styles` - Compiles, combines, and optimizes project CSS.
gulp.task("styles", function() {
    runSequence("scss-lint",
        "styles-bundle");
});

gulp.task("styles-bundle", function() {
    return gulp.src(styleMainSrcFiles)
        .pipe(sass({style: "compressed"})
            .on("error", function(err) {
                console.error(err.message);
                this.emit("end");
            }))
        .pipe(cleanCss())
        .pipe(gulp.dest(distDir));
});

// ### SCSS Lint
// `gulp scss-lint` - Lints SCSS files
gulp.task("scss-lint", function() {
    var processors = [
        stylelint(),
        reporter({
            clearMessages: true,
            throwError: true
        })
    ];

    return gulp.src([styleSrcFiles, "!" + styleMainSrcFiles])
        .pipe(postcss(processors, {syntax: syntaxScss}));
});

// ### Scripts
// `gulp scripts` - Merges all lib files with app.js, into distDir
// and project JS.
gulp.task("scripts", function() {
    runSequence("js-lint",
        "js-bundle",
        "js-libs");
});

// ### ESLint
// `gulp js-lint` - Lints project JS.
gulp.task("js-lint", function() {
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

// ### Bundling sources and small libs via Webpack & Babel
// `gulp js-bundle`
gulp.task("js-bundle", function() {
    runWebpack("common.js");
    runWebpack("signIn.js");
    runWebpack("orderList.js", "controllers/order-list/");
    runWebpack("assessment.js", "controllers/assessment/");
    return runWebpack("reportPreview.js", "controllers/report-preview/");
});

function runWebpack(entryFileName, srcSubDir) {
    srcSubDir = srcSubDir || "controllers/";

    return gulp.src(scriptSrcDir + srcSubDir + entryFileName)
        .pipe(webpackStream({
            module: {
                loaders: [
                    {
                        test: /assets[\/\\]scripts[\/\\][\w\-\/\\]+.js$/,
                        loader: "babel-loader"
                    }
                ]
            },
            output: {
                filename: entryFileName
            }
        }))
        .pipe(gulp.dest(scriptDistDir));
}

// `gulp js-libs`
gulp.task("js-libs", function() {
    runSequence("js-libs-concat",
        "js-libs-uglify");
});

// ### Concatenating large libraries used in most pages. Those listed in `.eslintrc > globals`
gulp.task("js-libs-concat", function() {
    return streamSeries(
        gulp.src("node_modules/jquery/dist/jquery.slim.js"),
        gulp.src("node_modules/lodash/lodash.js"),
        gulp.src("node_modules/react/dist/react.min.js"),
        gulp.src("node_modules/react-dom/dist/react-dom.min.js"),
        gulp.src("node_modules/classnames/index.js"),
        gulp.src("node_modules/classnames/bind.js"),
        gulp.src("node_modules/classnames/dedupe.js"),
        gulp.src("node_modules/gsap/src/uncompressed/TweenLite.js"),
        gulp.src("node_modules/gsap/src/uncompressed/easing/EasePack.js"),
        gulp.src("node_modules/gsap/src/uncompressed/plugins/CSSPlugin.js"),
        gulp.src("node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js"),
        gulp.src("node_modules/moment/moment.js"),
        gulp.src("node_modules/bootstrap-sass/assets/javascripts/bootstrap/modal.js"),
        gulp.src("node_modules/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js"),
        gulp.src("node_modules/bootstrap-sass/assets/javascripts/bootstrap/tab.js"),
        gulp.src("node_modules/sortablejs/Sortable.js"),
        gulp.src(scriptVendorFiles))
        .pipe(concat(scriptDistFileNameConcat))
        .pipe(gulp.dest(scriptDistDir));
});

gulp.task("js-libs-uglify", function() {
    return pump([
        gulp.src(scriptDistDir + scriptDistFileNameConcat),
        uglify(),
        gulp.dest(scriptDistDir)
    ]);
});

// ### Images
// `gulp images` - Run lossless compression on all the images.
gulp.task("images", function() {
    return gulp.src(imageSrcFiles)
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [
                {removeUnknownsAndDefaults: false},
                {cleanupIDs: false}
            ]
        }))
        .pipe(gulp.dest(imageDistDir));
});

// ### Fonts
// `gulp fonts`
gulp.task("fonts", function() {
    return streamSeries(
        gulp.src("node_modules/font-awesome/fonts/*"),
        gulp.src(fontSrcFiles))
        .pipe(gulp.dest(fontDistDir));
});

// ### Clean
// `gulp clean` - Deletes the build folder entirely.
gulp.task("clean", function() {
    return del(distDir);
});

// ### Watch
// `gulp watch`
gulp.task("watch", function() {
    gulp.watch([[styleSrcFiles, "!" + styleMainSrcFiles]], ["styles"]);
    gulp.watch([scriptSrcFiles], ["scripts"]);
    gulp.watch([imageSrcFiles], ["images"]);
    gulp.watch([fontSrcFiles], ["fonts"]);
});

// ### Build
// `gulp build` - Run all the build tasks but don't clean up beforehand.
// Generally you should be running `gulp` instead of `gulp build`.
gulp.task("build", function() {
    runSequence("styles",
        ["scripts", "images", "fonts"]);
});

// ### Gulp
// `gulp` - Run a complete build. To compile for production run `gulp --production`.
gulp.task("default", function() {
    runSequence("clean", "build");
});
