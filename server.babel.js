/**
 * Created by Andy Likuski on 2016.08.02
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// https://medium.com/@viatsko/react-for-beginners-part-1-setting-up-repository-babel-express-web-server-webpack-a3a90cc05d1e#.tw3o67bmc
import express from 'express';
import path from 'path';

const app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');

// We point to our static assets
app.use(express.static(publicPath));

// If you only want this for development, you would of course
// put it in the "if" block below
app.all('/warehouse/*', function (req, res) {
    proxy.web(req, res, {
        target: 'https://3dwarehouse.sketchup.com',
        secure: false,
        changeOrigin: true
    });
});
app.all('/js**', function (req, res) {
    proxy.web(req, res, {
        target: 'https://3dwarehouse.sketchup.com',
        secure: false,
        changeOrigin: true
    });
});
app.all('/img**', function (req, res) {
    proxy.web(req, res, {
        target: 'https://3dwarehouse.sketchup.com',
        secure: false,
        changeOrigin: true
    });
});
app.all('/third-party**', function (req, res) {
    proxy.web(req, res, {
        target: 'https://3dwarehouse.sketchup.com',
        secure: false,
        changeOrigin: true
    });
});
app.all('/css**', function (req, res) {
    proxy.web(req, res, {
        target: 'https://3dwarehouse.sketchup.com',
        secure: false,
        changeOrigin: true
    });
});
app.all('/font**', function (req, res) {
    proxy.web(req, res, {
        target: 'https://3dwarehouse.sketchup.com',
        secure: false,
        changeOrigin: true
    });
});

if (!isProduction) {

    var bundle = require('./build/main.bundle.js');
    bundle();
    app.all('/build/*', function (req, res) {
        proxy.web(req, res, {
            target: 'http://localhost:8080'
        });
    });

}

proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
});

// And run the server
app.listen(port, function () {
    console.log('Server running on port ' + port);
});