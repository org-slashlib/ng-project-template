"use strict";

const path      = require( "path" );

const ANGULAR   = "angular";
const BUILD     = "build";
const CONFIG    = "config";
const DIST      = "dist";
const LIB       = "lib";

const SLASHLIBS = "@org.slashlib-*"

module.exports = function( grunt ) {
  // set grunt options
  grunt.option( "pkgjson",  grunt.file.readJSON( "package.json"  ));
  grunt.option( "versions", grunt.file.readJSON( "versions.json" ));

  grunt.initConfig({

    angularjson: {
      template:     "config/angular/angular.json",  // file relative to gruntfile.js
      build:        BUILD,                          // build directory - relative to gruntfile.js
      fragments:    [                               // search fragments in library directories
                      "**/angular.lib.json"         // relative to library directory
                    ],
      libs:         [ SLASHLIBS ],                  // directory pattern(s) for libraries
    },

    clean: {
      build:        [ `${BUILD}/**/*` ],
      dist:         [ `${DIST}/**/*`  ]
    },

    cleanempty: {
      // remove empty folders in build and dist directories
      always: {
        src:        [ `${BUILD}/**/*`, `${DIST}/**/*` ]
      },
    },

    copy: {
      prerequisites_angular: {
        files: [{
          expand:   true,
          cwd:      "config/angular",
          src:      [
                      "*",              // config files required for building angular libraries
                      "!angular.json",
                      "!*.bak.*",       // ignore backup files of type ...
                      "!*.bak"          // ignore backup files
                    ],
          dest:     BUILD
        }]
      }, // end of copy:prerequisites_angular

      prerequisites_lib: {
        files: [{
          expand:   true,
          src:      [
                      `${SLASHLIBS}/**/*`,                            // sources used for building angular libs
                      `!${SLASHLIBS}/*.bat`,                          // do not copy windows batchfiles
                      `!${SLASHLIBS}/*.lnk`,                          // do not copy windows desktop links
                      `!${SLASHLIBS}/config/**/*`,                    // do not copy configuration tree
                      `!${SLASHLIBS}/node-*/**/*`,                    // do not copy node executables from lirary directories (windows)
                      `!${SLASHLIBS}/node_modules`                    // do not copy node_modules from lirary directories
                    ],
          dest:     BUILD,
          rename:   function( dest, src ) {
                      // stick to posix, as grunt can handle win32 <=> posix conversions
                      return path.posix.join( dest, src.replace( /^[\/\\]?@org.slashlib-([^\/\\]*)/, "$1/" ));
                    }
        },{
          expand:   true,
          src:      [
                      `${SLASHLIBS}/config/angular/*`,                // sources used for building angular libs
                      `${SLASHLIBS}/config/karma/*`,                  // karma configuration for ng test
                      `!${SLASHLIBS}/config/angular/angular.lib.json` // do not copy angular.json library fragment
                    ],
          dest:     BUILD,
          rename:   function( dest, src ) {
                      src = src.replace( /^[\/\\]?@org.slashlib-([^\/\\]*)/, "$1/" );
                      src = src.replace( "angular", "" );
                      src = src.replace( "config",  "" );
                      src = src.replace( "karma",   "" );
                      // stick to posix, as grunt can handle win32 <=> posix conversions
                      return path.posix.join( dest, src );
                    }
        }]
      } // end of copy:prerequisites_i18n
    } // end of copy
  }); // end of grunt.initConfig

  grunt.loadNpmTasks( "grunt-angularjson-append-projects" );
  grunt.loadNpmTasks( "grunt-cleanempty"                  );
  grunt.loadNpmTasks( "grunt-contrib-clean"               );
  grunt.loadNpmTasks( "grunt-contrib-copy"                );
  grunt.loadNpmTasks( "grunt-eslint"                      );
  grunt.loadNpmTasks( "grunt-move"                        );
  grunt.loadNpmTasks( "grunt-newer"                       );
  grunt.loadNpmTasks( "grunt-shell"                       );

  grunt.registerTask( "clean-default",   [ "clean:dist", "clean:build", "cleanempty:always" ]);

  grunt.registerTask( "prepare-default", [ "newer:copy:prerequisites_angular", "newer:copy:prerequisites_lib", "cleanempty:always" ]);

  grunt.registerTask( "build-angular",   [ "shell:ng_build"/*, "move:post_ng_build" */ ]);

  grunt.registerTask( "default",         [ "clean-default", "angularjson", /* "eslint", */
                                           "prepare-default" /*, "build-angular" */ ]);
};
