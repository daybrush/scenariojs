module.exports = function(grunt) {
grunt.loadNpmTasks('grunt-babel');
grunt.loadNpmTasks('grunt-jsdoc');

grunt.initConfig({
    jsdoc : {
        dist : {
            src: ['./Scenario.js', "README.md"],
            options: {
                destination: 'doc',
                template: "node_modules/docdash"
            }
        }
    },
    babel: {
        options: {
            sourceMap: true,
            presets: ['babel-preset-es2015']
        },
        dist: {        	
            files: {
                './es5/Scenario.js': './Scenario.js'
            }
        }
    }
});


grunt.registerTask('default', ["babel", "jsdoc"]);
grunt.registerTask('doc', ["jsdoc"]);

}