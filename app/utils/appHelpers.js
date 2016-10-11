/**
 * Created by Andy Likuski on 2016.10.10
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/***
 * Returns a dictionary with one browser string set true
 */
export function isBrowser() {
    const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
    const isIE = !!document.documentMode
    const isChrome = !!window.chrome && !!window.chrome.webstore
    return {
        // Opera 8.0+
        isOpera: isOpera,
        // Firefox 1.0+
        isFirefox: typeof InstallTrigger !== 'undefined',
        // Safari <= 9 "[object HTMLElementConstructor]"
        isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
        // Internet Explorer 6-11
        isIE: isIE,
        // Edge 20+
        isEdge: !isIE && !!window.StyleMedia,
        // Chrome 1+
        isChrome: isChrome,
        // Blink engine detection
        isBlink: (isChrome || isOpera) && !!window.CSS
    }
}
