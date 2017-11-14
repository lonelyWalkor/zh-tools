module.exports = function(grunt) {
	"use strict";

	var isExpand = true;

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		copy: {
			product: {
				files: [{
					expand: isExpand,
					cwd: "development/",
					src: "**/*",
					dest: "production/",
					// dest: "modules",
					filter: "isFile"
				}]
			},
			test: {
				files: [{
					expand: isExpand,
					cwd: "development/",
					src: "**/*",
					dest: "test/",
					// dest: "modules",
					filter: "isFile"
				}]
			}
		},
		cssmin: {
			product: {
				files: [{
					expand: isExpand,
					cwd: "development/",
					src: "**/*.css",
					dest: "production/",
					// dest: "modules/css",
					ext: ".css"
				}]
			},
			test: {
				files: [{
					expand: isExpand,
					cwd: "development/",
					src: "**/*.css",
					dest: "test",
					// dest: "modules/css",
					ext: ".css"
				}]
			}
		},
		sass: {
			product: {
				files: [{
					expand: isExpand,
					cwd: 'development',
					src: ['*.scss'],
					dest: 'production',
					ext: '.css'
				}],
			},
			test: {
				files: [{
					expand: isExpand,
					cwd: 'development',
					src: ['*.scss'],
					dest: 'test',
					ext: '.css'
				}],
			}
		},
		uglify: {
			options: {
				banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n",
				mangle: true,
				compress: {
					drop_console: true
				}
			},
			product: {
				files: [{
					expand: isExpand,
					cwd: "development/",
					src: "**/*.js",
					dest: "production",
					ext: ".js"
				}]
			},
			test: {
				files: [{
					expand: isExpand,
					cwd: "development/",
					src: "**/*.js",
					dest: "test",
					ext: ".js"
				}]
			}
		},
		jshint: {
			all: ['**/*.js']
		},
		watch: {
			scripts: {
				files: ['**/*.js'],
				tasks: ['jshint', 'uglify']
			},
			sass: {
				files: ['**/*.scss'],
				tasks: ['sass']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				//自动刷新打开的页面
				files: [
					'index.html',
					'style.css',
					'js/global.min.js'
				]
			}
		},
		connect: {
			options: {
				port: 9000,
				open: true,
				livereload: 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname: 'localhost'
			},
			server: {
				options: {
					port: 9001,
					base: './'
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');


	grunt.registerTask("default", ["sass:test", "copy:test", "uglify:test", "cssmin:test", "connect", "watch"]);
	grunt.registerTask("product", ["sass:product", "copy:product", "uglify:product", "cssmin:product"]);
};