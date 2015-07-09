var path = require('path');

module.exports = function(grunt) {
    grunt.initConfig({
        express: {
            options: {
                port: 3000,
                hostname: '*'
            },
            livereload: {
                options: {
                    server: path.resolve('./app.js'),
                    livereload: true,
                    serverreload: true,
                    bases: [path.resolve('./public')]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');

    grunt.registerTask('default', ['express', 'express-keepalive']);
};
