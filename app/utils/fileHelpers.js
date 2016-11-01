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

/***
 * Force the download of a file by creating a link and clicking it
 * @param document: The document dom element
 * @param src: The src URL
 * @param suggestedName: Optional name of the file when downloaded
 */
export function forceDownload(document, src, suggestedName) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = suggestedName || ''
        link.href = src
        link.click();
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(src);
    }
}