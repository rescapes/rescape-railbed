/**
 * Created by Andy Likuski on 2016.09.12
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {Map} from 'immutable'
import config from '../config'

/**
 * Gets the current Scene key of the given Model3d used when iterating through all models
 * @param model
 * @returns {*}
 */
export function currentSceneKeyOfModel(model) {
    return model && model.getIn(['scenes', 'current'])
}

/**
 * The current Scene of the given Model3d
 * @param model
 * @returns {*}
 */
export function currentSceneOfModel(model) {
    return model && model.getIn(['scenes', 'entries', currentSceneKeyOfModel(model)])
}


/***
 * For the Media Gallery:
 * Given the current getModelTops returns the 'fade-out' or 'fade-in' class and if
 * fade-out the direction of the fadeout, 'upward' or 'downward'
 * If previous or next models are present we want to fade out since the current model
 * is no longer centered
 *
 * @param modelTops
 * @returns {[fade, toward]}
 */
export function calculateModelFadeAndToward(modelTops) {
    const fade = ['previous', 'next'].some(relevance => modelTops[relevance]) ?
        'fade-out' :
        'fade-in'
    // Fade the media in the direction that the current model is scrolling, which is based
    // on which mode is closer, previous or next.
    const toward = fade == 'fade-in' ?
        '' :
        (modelTops['next'] ?
            'upward' :
            'downward')
    return [fade, toward]
}


/***
 *
 * Calculate the getModelTops of the current, previous, and next models as a percent of how close an anchor element
 * representing them is to document scroll position. This means that
 *  1) the current model display below/above the closer of the previous/next model
 *  2) the previous model if any and closer than the next model displays above the current
 *  3) the next model if any and closer than the previous model displays below the current
 *  We also use the setings constant MODEL_PADDING to separate the bottom and top of two adjacent models.
 *  We also have a settings threshold MODEL_THRESHOLD before we give the previous or next model a non-null value. We don't want the scroll
 *  to begin immediately because models without scenes or with little text will never be centered otherwise.
 * Previous or next models only show on the top or bottom if they are different models than the current
 * Returns a Map of getModelTops for the 'current', 'previous', and 'next' keys.
 * e.g. {current: .25, previous: -.75-MODEL_PADDING, null} or {current: 0, previous: null, next: null} or
 * {current: -.25, previous: null, next: .75+MODEL_PADDING}
 */
export function getModelTops(document, models, settings) {
    const {current, previousForDistinctModel, nextForDistinctModel} = models.toObject()
    const distances = closestAnchorDistances(document, models)

    // If we don't have a current model, none of the getModelTops matter
    if (distances.get('current') == null) {
        return {current: null, previous: null, next: null}
    }
    const currentDistance = distances.get('current'),
        previousForDistinctModelDistance = distances.get('previousForDistinctModel'),
        previousDistance = distances.get('previous'),
        nextForDistinctModelDistance = distances.get('nextForDistinctModel'),
        nextDistance = distances.get('next'),
        // Increases as previous becomes more relevant
        previousFraction = currentDistance / (previousForDistinctModelDistance + currentDistance),
        // Increases as next becomes more relevant
        nextFraction = currentDistance / (nextForDistinctModelDistance + currentDistance)
    // If we're closer to the previous than the next,
    // the previous scene is a different model,
    // and within the threshold for transition
    if (previousFraction > nextFraction &&
        previousDistance == previousForDistinctModel &&
        previousFraction > config.MODEL_THRESHOLD &&
        previousForDistinctModel != current) {
        return {
            // Start at 0 and scroll down as previous gets more relevant
            current: currentDistance / (previousForDistinctModelDistance + currentDistance),
            // Start at above showcase at -(MODEL_PADDING + 1) and scroll down as previous gets more relevant
            previous: previousFraction - (config.MODEL_PADDING + 1),
            next: null
        }
    }
    // If we're closer to the next than the previous,
    // the next scene is a different model,
    // and within the threshold for transition
    else if (nextFraction > previousFraction &&
        nextDistance == nextForDistinctModelDistance &&
        nextFraction > config.MODEL_THRESHOLD &&
        nextForDistinctModel != current) {
        return {
            // Start at 0 and scroll up as next gets more relevant
            current: 0 - (currentDistance / (nextForDistinctModelDistance + currentDistance)),
            previous: null,
            // Start at 1 + MODEL_PADDING below screen and scroll up as next gets more relevant
            next: (1 + config.MODEL_PADDING) - nextFraction
        }
    }
    else {
        return {
            current: 0,
            previous: null,
            next: null
        }
    }

}

/***
 * Finds the closest anchor distances to the current scroll position
 * @param document: The current Document
 * @param models: The Model3ds of the current Document
 */
export function closestAnchorDistances(document, models) {
    // Used in conjunction with the scrollPosition to see if it's time to transition
    const closestAnchors = document.get('closestAnchors')
    const scrollPosition = document.get('scrollPosition')
    // Calculate the absolute distance from the current, previous, and next anchor to the scroll position
    // The previous/next distance is only valid if the model of the previous/next anchor is different than the current
    // model. If invalid we won't use it, but we still want to record it in case it's closer than the other one
    // (e.g. next might be the same model but closer than previous, which is a different model)
    return (closestAnchors || Map({})).map(
        (value, key) => value && models.get(key) ?
            Math.abs(scrollPosition - value.offsetTop) : null
    )
}

/***
 * For models that are grouped with others, this removes the parens from their title, so all group models
 * normalize to the same name
 * @param modelKey
 * @param model. Used to look for model.title, which takes precedence over modelKey
 * @returns {*}
 */
export function normalizeModelName(modelKey, model) {
    return model.get('title') || modelKey.replace(/ \(.*?\)$/, '')
}