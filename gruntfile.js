module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    stylus: {
      build: {
        files: [{
          expand: true,
          cwd: 'source',
          src: ['**/*.styl'],
          dest: 'build',
          ext: '.css'
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
          src: ['**/*.jade'],
          dest: 'build',
          ext: '.html'
        }]
      }
    },
    uglify: {
      files: {
        expand: true,
        cwd: 'source',
        src: ['**/*.js'],
        dest: 'build',
        ext: '.min.js'
      }
    },
    watch: {
      stylus: {
        files: 'source/**/*.styl',
        tasks: ['stylus'],
        options: {
          livereload: true
        }
      },
      jade: {
        files: 'source/**/*.jade',
        tasks: ['jade'],
        options: {
          livereload: true
        }
      },
      js: {
        files: 'source/**/*.js',
        tasks: ['uglify'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['stylus', 'jade', 'uglify', 'watch']);
}