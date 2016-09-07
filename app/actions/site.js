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

// Cross-component communication actions

// This action lets the document tell the model that the closest anchor in the text changed,
// impacted the current/next/pervious model
export const DOCUMENT_TELL_MODEL_ANCHOR_CHANGED = 'DOCUMENT_TELL_MODEL_ANCHOR_CHANGED'

// This action lets the gallery tell the model when the lightbox toggled on or off
export const LIGHTBOX_VISIBILITY_CHANGED = 'LIGHTBOX_VISIBILITY_CHANGED'

/*
 * Action types. See action definition for explanation
*/

// sets the full state to a stored value (e.g. from a cookie)
export const SET_STATE = 'SET_STATE'
export function setState(state=null) {
    return { type: SET_STATE, state: state }
}

/***
 * Register the given unloaded documents when encountered in the DOM or via the browser URL/parameters
 * This does not load the model since we might want to skip, queue or otherwise delay loading
 *
 * @param anchors: Immutable Map of anchors, containing keys 'current', 'previous', and 'next'
 * @returns {{type: string, key: *}}
 */
export function documentTellModelAnchorsChanged(anchors) {
    return { type: DOCUMENT_TELL_MODEL_ANCHOR_CHANGED, anchors }
}

/***
 * Lets the gallery report to he 3d model when the lightbox is turned on and off so that the
 * model can hide its own title and make other stylistic changes
 *
 * @param lightboxIsVisible: true if the lightbox is visible, default false
 * @returns {{type: string, key: *}}
 */
export function lightboxVisibilityChanged(lightboxIsVisible) {
    return { type: LIGHTBOX_VISIBILITY_CHANGED, lightboxIsVisible }
}