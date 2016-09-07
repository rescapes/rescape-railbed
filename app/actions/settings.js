/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/***
 * Defines the all actions of the application used manipulate the DOM.
 */

import fetch from 'isomorphic-fetch'
import ActionLoader from '../ActionLoader'

/*
 * Settings Actions. See methods for explanations below
*/

export const SET_3D = 'SET_3D'
export const SET_RELATED_IMAGES = 'SET_RELATED_IMAGES'

/***
 * Sets the DOM to show interactive 3D models when supported.
 * 
 * @param value: 
 *  true (default): show 3D model
 *  false: show 2D still images of 3D models when 3D is unsupported or the user wants 2D
 * @returns {{type: string, bool: value}}
 */
export function set3d(value=true) {
    return { type: SET_3D, value }
}

/***
 * Shows images related to the current 3D model or its current scene.
 * 
 * @param value
 *  true (default): show images
 *  false: hide images
 * @returns {{type: string, bool: value}}
 */
export function setRelatedImages(value=true) {
    return { type: SET_RELATED_IMAGES, value }
}
