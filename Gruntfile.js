module.exports = function(grunt) {
  // commonjs to module for browser
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.initConfig({
    connect: {
      dev: {
        options: {
          port: 9090,
          hostname: 'localhost',
          base: 'dist/dev/',
          livereload: true
        },
        middleware: function(connect, options) {
          return [
            require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
            connect.static(options.base)
          ];
        }
      },
      prod: {
        options: {
          port: 9099,
          hostname: 'localhost',
          base: 'dist/prod/',
          livereload: true
        }
      },
    },
    watch: {
      options: {
        livereload: true
      },
      'scripts-dev': {
        files: ['src/**/*.js'],
        tasks: ['browserify:dev']
      },
      'scripts-prod': {
        files: ['src/**/*.js'],
        tasks: ['browserify:prod', 'uglify:prod']
      },
      'css-dev': {
        files: ['src/styles.css'],
        tasks: ['copy:css-dev']
      },
      'css-prod': {
        files: ['src/styles.css'],
        tasks: ['copy:css-prod']
      },
      'copy-dev': {
        files: ['src/**/*.html'],
        tasks: ['copy:dev']
      },
      'copy-prod': {
        files: ['src/**/*.html'],
        tasks: ['copy:prod']
      }
    },
    browserify: {
      dev: {
        src: 'src/js/main.js',
        dest: 'dist/dev/js/main.js'
      },
      prod: {
        src: 'src/js/main.js',
        dest: 'dist/prod/js/main.js'
      }
    },
    uglify: {
       prod: {
        files: {
          'dist/prod/js/main.js': ['dist/prod/js/main.js']
        }
      }
    },
    copy: {
      'vendor-dev': {
        expand: true,
        cwd: 'bower_components/jquery/dist/',
        src: ['jquery.min.js'],
        dest: 'dist/dev/js/',
      },
      'html-dev': {
        expand: true,
        cwd: 'src/',
        src: ['index.html'],
        dest: 'dist/dev/',
      },
      'css-dev': {
        expand: true,
        cwd: 'src/css/',
        src: ['style.css'],
        dest: 'dist/dev/css/',
      },
      'vendor-prod': {
        expand: true,
        cwd: 'bower_components/jquery/dist/',
        src: ['jquery.min.js'],
        dest: 'dist/prod/js/',
      },
      'html-prod': {
        expand: true,
        cwd: 'src/',
        src: ['index.html'],
        dest: 'dist/prod/',
      },
      'css-prod': {
        expand: true,
        cwd: 'src/css',
        src: ['style.css'],
        dest: 'dist/prod/css',
      },
    }
  });

  grunt.registerTask('copy:dev', ['copy:html-dev', 'copy:css-dev', 'copy:vendor-dev']);
  grunt.registerTask('copy:prod', ['copy:html-prod', 'copy:css-prod', 'copy:vendor-prod']);
  grunt.registerTask('build:dev', ['copy:dev', 'browserify:dev']);
  grunt.registerTask('build:prod', ['copy:prod', 'browserify:prod', 'uglify:prod']);
  grunt.registerTask('server:dev', ['build:dev', 'connect:dev', 'watch']);
  grunt.registerTask('server:prod', ['build:prod', 'connect:prod', 'watch']);

};