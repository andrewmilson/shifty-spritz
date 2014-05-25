module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      build: {
        cwd: 'source',
        dest: 'build',
        src: ['**', '!**/*.styl', '!**/*.coffee', '!**/*.jade'],
        expand: true
      }
    },
    clean: {
      build: {
        src: ['build']
      },
      stylesheets: {
        src: ['build/**/*.css', '!build/application.css']
      },
      scripts: {
        src: ['build/**/*.js', '!build/application.js']
      }
    },
    stylus: {
      build: {
        options: {
          linenos: true,
          compress: true
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: ['**/*.styl'],
          dest: 'build',
          ext: '.css'
        }]
      }
    },
    autoprefixer: {
      build: {
        expand: true,
        cwd: 'build',
        src: [ '**/*.css' ],
        dest: 'build'
      }
    },
    cssmin: {
      build: {
        files: {
          'build/application.css': ['build/**/*.css']
        }
      }
    },
    uglify: {
      build: {
        options: {
          mangle: false
        },
        files: {
          'build/application.js': ['build/**/*.js']
        }
      }
    },
    jade: {
      compile: {
        options: {
          data: {}
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: [ '**/*.jade' ],
          dest: 'build',
          ext: '.html'
        }]
      }
    },
    watch: {
      stylesheets: {
        files: 'source/**/*.styl',
        tasks: ['stylesheets']
      },
      scripts: {
        files: 'source/**/*.js',
        tasks: ['scripts']
      },
      jade: {
        files: 'source/**/*.jade',
        tasks: ['jade']
      },
      copy: {
        files: ['source/**', '!source/**/*.styl', '!source/**/*.coffee', '!source/**/*.jade'],
        tasks: ['copy']
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: 'build',
          hostname: '*'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask(
    'scripts', 
    'Javascrips compression and shit.', 
    ['uglify', 'clean:scripts']
  );

  grunt.registerTask(
    'stylesheets',
    'All that CSS jazz.',
    ['stylus', 'autoprefixer', 'cssmin', 'clean:stylesheets']
  );

  grunt.registerTask(
    'build', 
    'Builds the project in the build/ directory', 
    ['clean:build', 'copy', 'stylesheets', 'scripts', 'jade']
  );

  grunt.registerTask(
    'default', 
    'Watches the project for changes, automatically builds them and runs a server.', 
    ['build', 'connect', 'watch']
  );
}

