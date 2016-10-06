var authConfig = grunt.file.readJSON('./config/auth.json');
module.exports = function(grunt) {
    grunt.initConfig({
        responsive_images: {
            options: {
                // ImageMagick is available on Heroku, not GraphicsMagick
                engine: 'im'
            },
            dev: {
                options: {
                    sizes: [{
                        width: 320
                    }, /*{
                        width: 500
                    }, {
                        width: 800
                    }*/, {
                        width: 1024
                    }, /*{
                       name: '',
                       width: '100%'
                    }*/
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
        firebase: {
            options: {
                //
                // reference to start with (full firebase url)
                //
                reference: 'https://grunt-firebase.firebaseio.com/demo',

                //
                // token is the secret key used for connecting to firebase from the server
                // this is redacted from the public repo... add a file called ./config/auth.json
                // with your token in it... { "token": "my token here" }
                //
                token: '<%= authConfig.token %>'
            },
            load: {
                files: [
                    { src: 'app/images_dist/**/*.*' }
                ]
                options: {
                    reference: "https://rescape-railbed.firebaseio.com",
                    mode: 'upload',
                    data: {
                        one: {
                            foo: 'bar'
                        },
                        two: [
                            { a: 'A' },
                            { b: 'B' },
                            { c: 'C' }
                        ],
                        three: [ 'first', 'second', 'third' ]
                    }
                }
            }
        }
    })
    grunt.loadNpmTasks('grunt-responsive-images')
    grunt.loadNpmTasks('grunt-firebase');
    grunt.registerTask('default', ['responsive_images'])
}