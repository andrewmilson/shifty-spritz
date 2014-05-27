module.exports = function(grunt) {
 
  // configure the tasks
  grunt.initConfig({
 
    copy: {
      build: {
        cwd: 'source',
        src: [ '**', '!**/*.styl', '!**/*.coffee', '!**/*.jade' ],
        dest: 'build',
        expand: true
      },
    },
 
    clean: {
      build: {
        src: [ 'build' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css', '!build/application.css' ]
      },
      scripts: {
        src: [ 'build/js/**/*.js' ]
      },
    },
 
    stylus: {
      build: {
        options: {
          linenos: true,
          compress: false
        },
        files: [{
          expand: true,
          cwd: 'source',
          src: [ '**/*.styl' ],
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
          'build/application.css': [ 'build/**/*.css' ]
        }
      }
    },
 
    coffee: {
      build: {
        expand: true,
        cwd: 'source',
        src: [ '**/*.coffee' ],
        dest: 'build',
        ext: '.js'
      }
    },
 
    uglify: {
      build: {
        files: [{
            expand: true,
            cwd: 'source',
            src: '**/*.js',
            dest: 'build'
        }]
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
        tasks: [ 'stylesheets' ]
      },
      scripts: {
        files: 'source/**/*.coffee',
        tasks: [ 'scripts' ]
      },
      jade: {
        files: 'source/**/*.jade',
        tasks: [ 'jade' ]
      },
      copy: {
        files: [ 'source/**', '!source/**/*.styl', '!source/**/*.coffee', '!source/**/*.jade' ],
        tasks: [ 'copy' ]
      }
    }

  });
 
  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
 
  // define the tasks
  grunt.registerTask(
    'stylesheets', 
    'Compiles the stylesheets.', 
    [ 'stylus', 'autoprefixer', 'cssmin', 'clean:stylesheets' ]
  );
 
  grunt.registerTask(
    'scripts', 
    'Compiles the JavaScript files.', 
    [ 'clean:scripts', 'coffee', 'uglify' ]
  );
 
  grunt.registerTask(
    'build', 
    'Compiles all of the assets and copies the files to the build directory.', 
    [ 'clean:build', 'copy', 'stylesheets', 'scripts', 'jade' ]
  );
 
  grunt.registerTask(
    'default', 
    'Watches the project for changes, automatically builds them and runs a server.', 
    [ 'build', 'watch' ]
  );
};