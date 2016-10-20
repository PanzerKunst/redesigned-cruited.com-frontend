// ## Imports
var del = require("del");
var gulp = require("gulp");
var cleanCss = require("gulp-clean-css");
var concat = require("gulp-concat");
var eslint = require("gulp-eslint");
var imagemin = require("gulp-imagemin");
var postcss = require("gulp-postcss");
var sass = require("gulp-sass");
var reporter = require("postcss-reporter");
var syntaxScss = require("postcss-scss");
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


// ## Gulp tasks
// Run `gulp -T` for a task summary

// ### Styles
// `gulp styles` - Compiles, combines, and optimizes Bower CSS and project CSS.
gulp.task("styles", function() {
    return gulp.src(styleMainSrcFiles)
        .pipe(sass({"style": "compressed"})
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
    // Stylelint config rules
    var stylelintConfig = {
        "rules": {
            "block-closing-brace-newline-after": "always",
            "block-closing-brace-newline-before": "always-multi-line",
            "block-closing-brace-space-before": "always-single-line",
            "block-no-empty": true,
            "block-opening-brace-newline-after": "always-multi-line",
            "block-opening-brace-space-after": "always-single-line",
            "block-opening-brace-space-before": "always",
            "color-hex-case": "lower",
            "color-hex-length": "short",
            "color-no-invalid-hex": true,
            "comment-empty-line-before": ["always", {
                except: ["first-nested"],
                ignore: ["stylelint-commands"]
            }],
            "comment-whitespace-inside": "always",
            "declaration-bang-space-after": "never",
            "declaration-bang-space-before": "always",
            "declaration-block-no-shorthand-property-overrides": true,
            "declaration-block-semicolon-newline-after": "always-multi-line",
            "declaration-block-semicolon-space-after": "always-single-line",
            "declaration-block-semicolon-space-before": "never",
            "declaration-block-single-line-max-declarations": 1,
            "declaration-block-trailing-semicolon": "always",
            "declaration-colon-newline-after": "always-multi-line",
            "declaration-colon-space-after": "always-single-line",
            "declaration-colon-space-before": "never",
            "font-family-name-quotes": "double-where-recommended",
            "function-calc-no-unspaced-operator": true,
            "function-comma-newline-after": "always-multi-line",
            "function-comma-space-after": "always-single-line",
            "function-comma-space-before": "never",
            "function-linear-gradient-no-nonstandard-direction": true,
            "function-parentheses-newline-inside": "always-multi-line",
            "function-parentheses-space-inside": "never-single-line",
            "function-url-quotes": "double",
            "function-whitespace-after": "always",
            "indentation": 2,
            "max-empty-lines": 3,
            "media-feature-colon-space-after": "always",
            "media-feature-colon-space-before": "never",
            "media-feature-no-missing-punctuation": true,
            "media-feature-range-operator-space-after": "always",
            "media-feature-range-operator-space-before": "always",
            "media-query-list-comma-newline-after": "always-multi-line",
            "media-query-list-comma-space-after": "always-single-line",
            "media-query-list-comma-space-before": "never",
            "media-query-parentheses-space-inside": "never",
            "no-eol-whitespace": true,
            "no-invalid-double-slash-comments": true,
            "no-missing-eof-newline": true,
            "number-leading-zero": "always",
            "number-no-trailing-zeros": true,
            "number-zero-length-no-unit": true,
            "rule-non-nested-empty-line-before": ["always-multi-line", {
                ignore: ["after-comment"]
            }],
            "selector-combinator-space-after": "always",
            "selector-combinator-space-before": "always",
            "selector-list-comma-newline-after": "always",
            "selector-list-comma-space-before": "never",
            "selector-pseudo-element-colon-notation": "double",
            "string-no-newline": true,
            "string-quotes": "double",
            "value-list-comma-newline-after": "always-multi-line",
            "value-list-comma-space-after": "always-single-line",
            "value-list-comma-space-before": "never",
            "max-nesting-depth": 4
        }
    };

    var processors = [
        stylelint(stylelintConfig),
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
    return runWebpack("orderList.js");
});

function runWebpack(entryFileName) {
    return gulp.src(scriptSrcDir + "controllers/" + entryFileName)
        .pipe(webpackStream({
            module: {
                loaders: [
                    {
                        test: /assets[\/\\]scripts[\/\\][\w\/\\]+.js$/,
                        loader: "babel-loader"
                    }
                ]
            },
            output: {
                filename: entryFileName
            }
        }))
        .pipe(gulp.dest(scriptDistDir));
};

// ### Concatenating large libraries used in most pages. Those listed in `.eslintrc > globals`
// `gulp js-libs`
gulp.task("js-libs", function() {
    return streamSeries(
        gulp.src("node_modules/jquery/dist/jquery.slim.min.js"),
        gulp.src("node_modules/lodash/lodash.min.js"),
        gulp.src("node_modules/react/dist/react.min.js"),
        gulp.src("node_modules/react-dom/dist/react-dom.min.js"),
        gulp.src("node_modules/gsap/src/minified/TweenLite.min.js"),
        gulp.src("node_modules/gsap/src/minified/easing/EasePack.min.js"),
        gulp.src("node_modules/gsap/src/minified/plugins/CSSPlugin.min.js"),
        gulp.src("node_modules/gsap/src/minified/plugins/ScrollToPlugin.min.js"),
        gulp.src(scriptVendorFiles))
        .pipe(concat("libs.js"))
        .pipe(gulp.dest(scriptDistDir));
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
