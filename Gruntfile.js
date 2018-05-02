module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        watch: {
            scripts: {
                files: ["./javascripts/**/*.js", "!node_modules/**/*.js", "!bower_components/**/*.js"],
                tasks: ["concat:squash", "uglify"],
                options: {
                    spawn: false,
                }
            }
        },
        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n",
                sourceMap: true,
                sourceMapIncludeSources: true,
                sourceMapIn: '.tmp/main.js.map'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: ".tmp",
                    src: "main.js",
                    dest: "build",
                    ext: ".min.js"
                }]
            }
        },
        concat: {
            options: {
                sourceMap: true
            },
            squash: {
                src: [
                    'javascripts/util.js', 'javascripts/Gauntlet.js', 'javascripts/player.js',
                    'javascripts/weapons.js', 'javascripts/battleground.js', 'javascripts/classes.js',
                    'javascripts/horde.js', 'javascripts/spells.js', 'javascripts/app.js',
                    'javascripts/templates.js'
                ],
                dest: '.tmp/main.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks("grunt-contrib-uglify-es");
    // Load the plugin that provides the "watch" task.
    grunt.loadNpmTasks("grunt-contrib-watch");
    // Load the plugin that provides the "concat" task.
    grunt.loadNpmTasks("grunt-contrib-concat");

    // Default task(s).
    grunt.registerTask("default", ["concat:squash", "uglify", "watch"]);
    grunt.registerTask("build", ["concat:squash", "uglify"]);
};
