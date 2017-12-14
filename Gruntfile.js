module.exports = function(grunt) {

        // Project configuration.
        grunt.initConfig({
            pkg: grunt.file.readJSON("package.json"),
            watch: {
                scripts: {
                  files: ["./javascripts/**/*.js", "!node_modules/**/*.js", "!bower_components/**/*.js"],
                  tasks: ["uglify"],
                  options: {
                    spawn: false,
                  },
                }
            },
            uglify: {
                options: {
                    banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n",
                    sourceMap: true
                },
                build: {
                    files: [{
                        expand: true,
                        cwd: "javascripts",
                        src: "*.js",
                        dest: "build",
                        ext: ".min.js"
                    }]
                }
            }
        });

        // Load the plugin that provides the "uglify" task.
        grunt.loadNpmTasks("grunt-contrib-uglify");
        grunt.loadNpmTasks("grunt-contrib-watch");

        // Default task(s).
        grunt.registerTask("default", ["uglify", "watch"]);
        grunt.registerTask("build", ["uglify"]);

    };
