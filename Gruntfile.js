/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
// Generated on 2014-03-05 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    app: {
      // configurable paths
      src: 'src',
      dist: 'www',
      url: '',
      default_local_server_url: 'http://localhost:8001'
    },

    copy: {
      static: {
        files: [
          {expand: true, cwd: '<%= app.src %>/', src: ['**/*.html'], dest: '<%= app.dist %>', filter: 'isFile'},
          {expand: true, cwd: '<%= app.src %>/', src: ['**/*.json'], dest: '<%= app.dist %>', filter: 'isFile'},
        ],
      },
      css: {
        files: [
          {cwd: 'node_modules/', src: ['angular-material/angular-material.css', 'patternfly/dist/css/patternfly.css', 'c3/c3.css'], dest: '<%= app.dist %>/css/', expand: true, flatten: true },
          {cwd: 'node_modules/patternfly/dist/', src: 'fonts/**/*.*', dest: '<%= app.dist %>/', expand: true },
        ]
      }
    },

    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                '<%= app.dist %>/css/portal.css': '<%= app.src %>/sass/portal.scss'
            }
        }
    },

    browserify: {
      options: {
        browserifyOptions: {
           debug: true
        }
      },
      all: {
        files: {
          "<%= app.dist %>/app/bundle.js": ["<%= app.src %>/app/main.js"]
        },
        options: {
          watch: true
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= app.dist %>/app/bundle.js'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      html: {
        files: ['<%= app.src %>/{,*/}*.html'],
        tasks: ['copy:static']
      },
      sass: {
        files: ['<%= app.src %>/sass/{,*/}*.scss'],
        tasks: ['sass']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= app.dist %>/**/*.html',
          '<%= app.dist %>/css/{,*/}*.css',
          '<%= app.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9003,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35731
      },
      livereload: {
        options: {
          open: {
            target: '<%= app.url %>'
          },
          base: [
            '.tmp',
            '<%= app.dist %>'
          ]
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: ['<%= app.dist %>'],
      server: '.tmp'
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'local') {
      var conn = 'http://' + grunt.config.get('connect.options.hostname') + ':' +
        grunt.config.get('connect.options.port');
      var url = grunt.option('url') || grunt.config.get('app.default_local_server_url');
      grunt.config.set('app.url', conn + '/?url=' + url);
    } else {
      // open with no url passed to fh-js-sdk
      grunt.config.set('connect.livereload.options.open', true);
    }

    grunt.task.run([
      'clean:dist',
      'sass',
      'copy',
      'clean:server',
      'browserify',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('default', ['serve']);
};
