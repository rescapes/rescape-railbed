/**
 * Created by Andy Likuski on 2021.01.31
 * Copyright (c) 2021 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import path from 'path';
import im from 'imagemagick';
import glob from 'glob';
import * as R from 'ramda';

const dir = './app/images'
const destDir = './app/images_dist'
const widths = [320, 1024];
// options is optional
glob(`${dir}/*/*.+(jpg|svg|png)`, {}, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
  R.forEach(width => {
    R.forEach(file => {
      const extension = path.extname(file);
      const name = path.basename(file,extension);
      im.resize({
        srcPath: file,
        dstPath: `${destDir}/${name}-${width}${extension}`,
        width: width
      }, function (err, stdout, stderr) {
        if (err) throw err;
        console.log(`resized ${file} to ${width}`);
      });
    }, files);
  }, widths);
});