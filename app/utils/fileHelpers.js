/**
 * Created by Andy Likuski on 2016.09.09
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import firebase from "firebase";
var fs  = require('fs');
/***
 * Because webpack is too incompetent to handle spaces, accents, etc, this function
 * normalizes keys to match our dumbed-downed file names
 */
export function normalizeKeyToFilename(key) {
    // Make - into _, make accents not, remove parens
    return key.replace(/( |-)/g, '_')
        .replace(/é/g, 'e')
        .replace(/(\(|\))/g, '')
}

window.uploadFirebaseFiles = function uploadFirebaseFiles() {
    // Create a root reference
    const storageRef = firebase.storage().ref();
    var req = require.context('../images_dist/', true, /\.(jpg|png|gif)$/)
    req.keys().forEach(function(key){
        var contents = fs.readFileSync(key)
        const file = fs.createReadStream(key, { encoding: 'binary' });
        const ext = key.split(".").slice(-1)[0]
        const fileRef = storageRef.child(key);
        const metadata = {
            contentType: `image/${key}`
        };
        fileRef.put(contents, metadata).then(function(snapshot) {
            console.log(`Uploaded file ${key}`);
        });
    })
}