/**
 * Created by Andy Likuski on 2016.09.30
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/***
 * Configuration values for the app
*/

export default  {
    PRODUCTION_DOMAIN: 'rescapes.net',
    // Threshold for visually switching between 3d models in the showcase
    // The previous/next must be > 40% closer than the current model
    MODEL_THRESHOLD: .4,
    // Padding between models when switching
    MODEL_PADDING: .1,
    // Don't put scene anchors more than this close to the next model
    // This prevents switching scenes and models at the same time.
    MAX_SCENE_POSITION: .9,
    // Video scenes are 4 seconds long,
    // This can be overridden in each model if needed
    SCENE_TRANSITION_TIME: 4,
    // The normal number of model nodes to show for both the top and bottom table of contents
    TABLE_OF_CONTENTS_MODEL_NODE_COUNT: 2,
    // When scrolling to a section of the document, use this offset to make it look better
    SCROLL_OFFSET: 30
}