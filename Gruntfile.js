module.exports = function(grunt) {
    grunt.initConfig({
        responsive_images: {
            dev: {
                options: {
                    sizes: [{
                        width: 320
                    }, {
                        width: 500
                    }, {
                        width: 800
                    }, {
                        width: 1024
                    }
                    ]
                },
                files: [{
                    expand: true,
                    src: ['app/images/**/*.{jpg,gif,png}'],
                    dest: 'images_dist/'
                }]
            }
        },
    })
    grunt.loadNpmTasks('grunt-responsive-images')
    grunt.registerTask('default', [''])
}