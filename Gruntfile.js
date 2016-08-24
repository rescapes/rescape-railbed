module.exports = function(grunt) {
    grunt.initConfig({
        responsive_images: {
            dev: {
                options: {
                    sizes: [
                    {
                        name: 'thumbnail',
                        width: 100
                    }, {
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
                    cwd: 'app/images',
                    src: ['**/*.{jpg,gif,png}'],
                    dest: 'app/images_dist'
                }]
            }
        },
    })
    grunt.loadNpmTasks('grunt-responsive-images')
    grunt.registerTask('default', [''])
}