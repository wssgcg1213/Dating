/**
 * Created by Liuchenling on 6/2/15.
 */
module.exports = function(grunt) {
    var config = grunt.file.readJSON('grunt.config.json');
    var configObj = {
        config: config
    };

    function rename(dest, src) {
        return dest + src.slice(src.lastIndexOf('/'));
    }

    configObj.copy = {
        default: {
            files: [{
                    src: ["src/index.html"],
                    dest: "dist/index.html"
                }, {
                    src: ["src/tpl/*.html"],
                    dest: "dist/tpl/",
                    rename: rename,
                    expand: true,
                    filter: 'isFile'
                }, {
                    src: "src/lib/require.js",
                    dest: "dist/lib/require.js"
                }, {
                    src: ["src/style/main.css"],
                    dest: "dist/style/",
                    rename: rename,
                    expand: true,
                    filter: 'isFile'
                },{
                    src: ["src/style/iconfont.*"],
                    dest: "dist/style/",
                    rename: rename,
                    expand: true,
                    filter: 'isFile'
                },{
                    src: "src/lib/flexible.js",
                    dest: "dist/lib/flexible.js"
            }]
        }
    };

    configObj.imagemin = {                          // Task
        dynamic: {                         // Another target
            files: [{
                expand: true,                  // Enable dynamic expansion
                cwd: '',                   // Src matches are relative to this path
                src: "src/imgs/*.{jpg,png,gif}",   // Actual patterns to match
                dest: "dist/imgs/",                 // Destination path prefix
                rename: rename
            }]
        }
    };

    //require 压缩合并
    configObj.requirejs = {
        compile: {
            options: {
                optimize: "uglify",
                baseUrl: "src/lib",
                name: "index",
                out: 'dist/lib/index.js',
                paths: {
                    avalon: "avalon.mobile.shim",
                    jquery: "jquery-2.1.3",
                    dialog: "jq.dialog"
                }
            }
        }
    };


    //end
    grunt.initConfig(configObj);

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.registerTask('default', ['copy', 'imagemin', 'requirejs']);
}