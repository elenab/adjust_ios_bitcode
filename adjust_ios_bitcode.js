#!/usr/bin/env node

/*
 * Change bitcode to NO in build settings
 */

var fs = require("fs"),
    path = require("path"),
    xcode = require('xcode'), 
    shell = require('shelljs'), 
    projectPath = 'platforms/ios/{{title}}.xcodeproj/project.pbxproj',
    found = false, 
    xcodeProject = xcode.project(projectPath);

xcodeProject.parse(function(err) {
   if (err) {
       shell.echo('Error: ' + JSON.stringify(err));
   } else {
    var buildConfig = xcodeProject.pbxXCBuildConfigurationSection();
    propReplace(buildConfig, 'ENABLE_BITCODE', 'NO');
    fs.writeFileSync(projectPath, xcodeProject.writeSync(), 'utf-8');
   }
});

// helper recursive prop search+replace
function propReplace(obj, prop, value) {
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (typeof obj[p] == 'object') {
                propReplace(obj[p], prop, value);
            } else if (p == prop) {
                obj[p] = value;
                found = true;
            }
        } 
    }
    if (!found) {
        //add property @@TODO@@ more fine tunning in the future
        //shell.echo('Add property for disabling bitcode...');
        obj[prop] = value;
    }

}
