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
import config from '../config'

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
        const modelKeyNormalized = normalizeModelName(modelKey, model)
        // Make a pseudoAnchor since DOM elements don't hash properly
        // We use offsetParent since anchors are inside of .model-sections
        const pseudoAnchor = Map({name: modelKeyNormalized, offsetTop: anchor.offsetParent.offsetTop})
        const models = (reduction.get(pseudoAnchor) || OrderedMap()).set(modelKey, model)
        if (models.count() == 1) {
            // Side-effect: put a name and href on the anchor so it can be used for url navigation
            anchor.name = modelKeyNormalized
            anchor.href = `#${modelKeyNormalized}`
        }
        return reduction.set(pseudoAnchor, models)
    }, OrderedMap());
}

/***
 * Create the Scene pseudo-anchors of all of the models. Scene anchors are positioned equidistant
 * between models. If several models share the same anchor, all the scenes of those models are
 * spread equally
 * @param anchorToModels
 * @param scrollHeight: Used for the spread between the last model and the bottom of the document
 */
export function getSceneAnchors(anchorToModels, scrollHeight) {
    const minScenePosition = config.MIN_SCENE_POSITION
    const maxScenePosition = config.MAX_SCENE_POSITION
    return anchorToModels.entrySeq().flatMap(function ([anchor, models], i) {
        // Find the next anchor position or failing that the bottom of the dom element
        const nextAnchorOffsetTop = anchorToModels.count() > i + 1 ?
            anchorToModels.keySeq().get(i + 1).get('offsetTop') :
            scrollHeight

        // Get the scenes of all models of this anchor
        const sceneKeys = models.valueSeq().flatMap(model => model.getIn(['scenes', 'entries']).keySeq())
        const allScenesCount = sceneKeys.count()
        let counter = 0
        return models.entrySeq().flatMap(([modelKey, model], index) =>
            model.getIn(['scenes', 'entries']).keySeq().map(function (sceneKey) {
                return {
                    name: `${modelKey}_${sceneKey}`,
                    // The scene index of the model or model group
                    // Used for displaying the scene circles
                    index: counter++,
                    // Position the scene between this anchor and the next (or bottom of document)
                    // The first scene is positioned at a fixed pixel distance below the anchor,
                    // and the last somewhere before the next anchor
                    // Use maxScenePosition % (e.g. .8) to make sure no scene is too close to the next model
                    offsetTop: anchor.get('offsetTop') + minScenePosition +
                        (nextAnchorOffsetTop - anchor.get('offsetTop') - minScenePosition - maxScenePosition) *
                        sceneKeys.indexOf(sceneKey) /
                        allScenesCount
                }
            })
        )
    }).toArray()
}

/***
 * If we are in the process of scrolling to a model, this returns true
 * @param document: The Document
 * @returns {boolean}
 */
export function isSeeking(document) {
    return document.get('isScrolling')
}

//http://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-with-javascript-without-page-refresh/5298684#5298684
/***
 * Remove the hash from the url when the user opens or closes an overlay document
 */
export function removeHash () {
    var scrollV, scrollH, loc = window.location;
    if ("pushState" in history)
        history.pushState("", document.title, loc.pathname + loc.search);
    else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.body.scrollTop;
        scrollH = document.body.scrollLeft;

        loc.hash = "";

        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scrollV;
        document.body.scrollLeft = scrollH;
    }
}

export function replaceHash(hash) {
    const loc = window.location;
    if ("pushState" in history)
        history.pushState("", document.title, `${loc.pathname}#${hash}${loc.search}`);
    else {
        loc.hash = `#${hash}`;
    }
}
