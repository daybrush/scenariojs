module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-jsdoc');
grunt.initConfig({
    jsdoc : {
        dist : {
            src: ['./Scenario.js'],
            options: {
                destination: 'doc'
            }
        }
    }
});


grunt.registerTask('default', [ 'jsdoc']);

}