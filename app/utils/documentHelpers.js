/**
 * Created by Andy Likuski on 2016.09.26
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {Map, OrderedMap, List} from 'immutable'
import {normalizeModelName} from './modelHelpers'

/***
 * Maps the DOM anchors of a document to the given models.
 * One anchor can represent multiple models if the models are related to the same subject.
 * This also has the side effect of naming the actual anchors to match the normalized name
 * @param anchors
 * @param models
 * @returns {*} an OrderedMap keyed by a pseudo-anchor Map({name: normalized model name, offsetTop: position from top of document div}
 */
export function getAnchorToModels(anchors, models) {
    return models.entrySeq().reduce(function (reduction, [modelKey, model]) {
        const anchor = anchors.find(anchor=>anchor.id == model.get('anchorId'))
        if (!anchor)
            throw `Model: ${modelKey} with anchorId ${model.get('anchorId')} cannot find its anchor in the document`
        // Remove the () of the model key to generalize the name
        // Models with the same anchors use (difference) to differentiate their keys
        const modelKeyNormalized = normalizeModelName(modelKey)
        // Make a pseudoAnchor since DOM elements don't hash properly
        const pseudoAnchor = Map({name: modelKeyNormalized, offsetTop: anchor.offsetTop})
        const models = (reduction.get(pseudoAnchor) || OrderedMap()).set(modelKey, model)
        if (models.count() == 1) {
            // Side-effect: put a name and href on the anchor so it can be used for url navigation
            anchor.name = modelKeyNormalized
            anchor.href = `#${modelKeyNormalized}`
        }
        return reduction.set(pseudoAnchor, models)
    }, OrderedMap());
}

