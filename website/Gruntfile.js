module.exports = function (grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        eslint: {
            target: [
                "javascript/**/*.js"
            ],
            options: {
                configFile: "eslint.json"
            }
        },

        babel: {
            site: {
                files: {
                    "public/react-site.js": [
                        "javascript/controllers/**/*.react.js"
                    ]
                }
            }
        },

        concat: {
            site: {
                options: {
                    separator:";"
                },
                src: [
                    // Non-CDN libs
                    "libs/p.js",
                    "libs/js-breakpoints/breakpoints.js",
                    "libs/classnames.js",

                    // Global
                    "javascript/global.js",

                    // Common

                    // Services
                    "javascript/services/browser.js",
                    "javascript/services/validator.js",
                    "javascript/services/animator.js",
                    "javascript/services/string.js",
                    "javascript/services/keyboard.js",

                    // Models

                    // Controllers
                    "javascript/controllers/base.js",
                    "javascript/controllers/index.js",

                    // React
                    "public/react-site.js"
                ],
                dest: "public/site.js"
            },
            all: {
                options: {
                    separator:";"
                },
                src: [
                    // Site
                    "public/site.js"
                ],
                dest: "public/<%= pkg.name %>.js"
            }
        },

        sass: {
            build: {
                files: {
                    "public/<%= pkg.name %>.css": "sass/<%= pkg.name %>.scss"
                }
            }
        },

        cssmin: {
            build: {
                src: [
                    // Libs
                    "libs/h5bp/normalize.css",

                    // Rest
                    "public/<%= pkg.name %>.css"
                ],
                dest: "public/<%= pkg.name %>-v1.css"
            }
        },

        copy: {
            fontAwesome: {
                files: [
                    {
                        expand: true,
                        cwd: "libs/font-awesome/fonts/",
                        src: ["*"],
                        dest: "public/fonts/font-awesome"
                    }
                ]
            }
        },

        watch: {
            js: {
                files: [
                    "<%= concat.site.src %>",
                    "javascript/controllers/**/*.react.js"
                ],
                tasks: ["buildjs"]
            },

            css: {
                files: [
                    "sass/**/*.scss"
                ],
                tasks: ["buildcss"]
            }
        }
    });

    grunt.registerTask("default", ["buildjs", "buildcss", "copy", "watch"]);
    grunt.registerTask("buildjs",  ["eslint", /* TODO "babel:site", */ "concat:site", "concat:all"]);
    grunt.registerTask("buildcss",  ["sass", "cssmin"]);
};
