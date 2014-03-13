module.exports = function(grunt) {
    'use strict';
    
    //  Load Grunt Tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    //
    //  Configure Grunt Tasks
    //

    grunt.initConfig({
        //
        //  Javscript Management
        //

        // Compile Handlebar Templates
        handlebars: {
            build: {
                options: {
                    namespace: 'Templates'
                },

                src: ['assets/templates/**/*.hbs', 'assets/templates/**/*.handlebars'],
                dest: 'dist/templates.js'
            }
        },

        // Compile Bower Modules
        bower_concat: {
            build: {
                bowerOptions: {
                    offline: true
                },
                dest: 'dist/lib.js',
                dependencies: {
                    'underscore': 'jquery',
                    'backbone': 'underscore',
                    'tendon': 'backbone'
                }
            }
        },

        // Compile All Javascript
        concat: {
            lib: {
                src: [
                    'dist/lib.js',
                    'assets/library/**/*.js',
                    'dist/templates.js'
                ],

                dest:'dist/lib.js'

            },

            app: {
                src: [
                    'assets/scripts/before/**/*.js',
                    'assets/app/collections/**/*.js',
                    'assets/app/models/**/*.js',
                    'assets/app/views/**/*.js',
                    'assets/app/app.js',
                    'assets/scripts/after/**/*.js'
                ],
                dest: 'dist/app.js'
            }
        },

        // Minimize Javascripts
        uglify: {
            options: { mangle: true },
            lib: {
                src: ['dist/lib.js'],
                dest: 'dist/min/lib.js'
            },
            app: {
                src: ['dist/app.js'],
                dest: 'dist/min/app.js'
            }
        },

        //
        //  CSS Managments 
        //

        // Style Sheet Tasks
        compass: {
            options: {
                sassDir: 'assets/sass',
                cssDir: 'dist/',
                noLineComments: false
            },
            
            build: {
                options: {
                    outputStyle: 'nested',
                    environment: 'development'
                }
            }
        },  

        autoprefixer: {
            build: {
                src: 'dist/style.css',
                dest: 'dist/style.css'
            }
        },
        
        cmq: {
            production: {
                files: [{
                    'dist': ['dist/style.css']
                }]
            },
        },


        cssmin: {
            compress: {
                files: {
                    'dist/min/style.css': ['dist/style.css']
                }
            }
        },


        //
        //  SVG Management
        //

        // Minimize SVGs
        svgmin: {
            dist: {
                options: {
                    removeViewBox: true,
                    removeUselessStrokeAndFill: false
                },
                files:[{
                    expand: true,
                    src: ['**/*.svg'],
                    cwd: 'assets/svgs',
                    dest: 'temp/svgs'
                }]
            }
        },

        grunticon: {
            options: {
                svgo: true,
                pngcrush: true,
                defaultHeight: "128px"
            },

            dist: {
                files: [{
                    expand: true,
                    src: ['**/*.svg', '**/*.png'],
                    cwd: 'temp/svgs',
                    dest: "dist/icons"
                }],
                options: {
                    pngfolder: "fallback",
                    loadersnippet: "grunticon.loader.js"
                }
            }
        },


        //
        //  Asset Managment
        //
        
        // Copy Assets to Distibution
        copy: {
            images: {
                files: [{
                    expand: true,
                    src: ['**'],
                    cwd: 'assets/images',
                    dest: 'dist/images'
                }]
            }
        },


        clean: {
            svg: ["temp", "dist/icons/preview.html"],
        },

        
        //
        //  Tests
        //

        casperjs: {
            options: {
                async: {
                    parallel: true
                }
            },

            test: {
                src: ['test/casper/']
            }
        },


        // watching tasks

        watch: {
            options: {
                debounceDelay: 250
            },

            bower: {
                files: ['bower_components/**/*.js', 'assets/scripts/**/*.js'],
                tasks: ['bower_concat', 'concat:lib', 'uglify:lib']
            },

            scripts: {
                files: ['assets/app/**/*.js', 'assets/scripts/**/*.js'],
                tasks: ['concat:app']
            },

            styles: {
                files: ['assets/sass/style.scss', 'assets/sass/*/*.scss', 'assets/fonts/*.css'],
                tasks: ['compass']
            },

            svgs: {
                files: ['assets/svgs/**/*'],
                tasks: ['svgs']
            },

            images: {
                files: ['assets/images/**/*'],
                tasks: ['copy:images']
            },

            templates: {
                files: ['assets/templates/**/*.hbs'],
                tasks: ['handlebars', 'concat:lib', 'uglify:lib']
            },

            casper: {
                files: ['test/casper/**/*.js'],
                tasks: ['casperjs']
            }
        }
    });

    //
    //  Register Grunt CL Tasks
    //

    
    // JS + CSS + SVGS
    grunt.registerTask('scripts', ['bower_concat', 'concat']);
    grunt.registerTask('styles', ['compass', 'autoprefixer', 'cmq', 'cssmin']);
    grunt.registerTask('svgs', ['svgmin', 'grunticon', 'clean']);
    
    // Asset Managment
    grunt.registerTask('images', ['copy:images']);

    grunt.registerTask('dist', [
        'handlebars', 
        'scripts',
        'styles',
        'svgs',
        'copy',
        'handlebars',
        'uglify'
    ]);

    grunt.registerTask('default', ['dist', 'watch']);

    // Tests
    grunt.registerTask('test', ['casperjs']);
};