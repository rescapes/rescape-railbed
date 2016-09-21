/**
 * Created by Andy Likuski on 2016.05.24
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {Map, List} from 'immutable';
import {SET_STATE} from '../actions/site'
import * as actions from '../actions/document'
import Statuses from '../statuses'

/***
 * Reduces the state of the documents
 * @param state:
 * {
 *      keys: [],
 *      current: null,
 *      baseUrl: null,
 *      postUrl: null,
 *      entries: {
 *      }
 *  } (default): The documents is not loaded 
 *  {
 *   keys: [known documents keys],
 *   current: documents key of the current model,
 *   baseUrl: base url of the documents, the url of the entry completes the url
 *   siteUrl: base url of the blog site, the postUrl of the entry completes the url
 *   entries: {
 *      [documents key]: {
 *         status: one of Statuses
 *         name: name of the document
 *         url: Url of a publicly available document (e.g. from Google Drive)
 *         postUrl: Url of the blog post (e.g. http://rescapes.net/the_amtrak_standard)
 *         title: The title of the document
 *         content: The loaded content of the document
 *         models: [the model keys of the document]
 *      }
 *  }
 * @param action
 * @returns {*}
 */
export default function(state = Map({keys: List(), current: null, entries: Map({})}), action) {
    const currentDocumentKey = state.get('current')

    // If setting state we will receive the full state
    if (action.type==SET_STATE) {
        return state.merge(action.state.get('documents'));
    }
    // Sets the document to be the current one
    // Also sets up the siteUrl of the document for use in social media links, etc
    else if (action.type==actions.SHOW_DOCUMENT) {
        return state
            .set('current', action.key)
            .setIn(['entries', action.key, 'postUrl'], state.get('siteUrl')(action.key))
    }
    else if (action.type==actions.REGISTER_DOCUMENT) {
        return (!state.get('keys').has(action.key)) ?
            state
            // add the model key to the result array
                .updateIn(['keys'], list=>list.push(action.key))
                // merge the entry into the entries
                .mergeDeep({
                    entries: {
                        [action.key]: {
                            key: action.key,
                            // status is initialized, nothing is loaded yet
                            status: Statuses.INITIALIZED,
                        }
                    }
                }) :
            state;
    }
    // Indicates that the load of the documents has begun
    else if (action.type==actions.LOAD_DOCUMENT) {
        return state.mergeDeep({
            entries: {
                [action.key]: {
                    status: Statuses.LOADING,
                    url: action.url,
                }
            }
        })
    }
    // Upon loading indicates the model is ready for interaction
    else if (action.type==actions.RECEIVE_DOCUMENT) {
        return state
        // merge the entry's content
            .mergeDeep({
                entries: {
                    [action.key]: {
                        // status is initialized, nothing is loaded yet
                        status: Statuses.READY,
                        content: action.content
                    }
                }
            })
    }
    else if (action.type==actions.DOCUMENT_ERRED) {
        return state.setIn(['entries', action.key, 'status'], Statuses.ERROR);
    }
    else if (action.type==actions.REGISTER_ANCHORS) {
        // When the document is fully loaded our Component inspects its DOM and sends
        // all of the <a id=...> tags it finds. These represent anchors to the models
        // or their scenes.
        return state.setIn(['entries', state.get('current'), 'anchors'], action.anchors)
    }
    // Sets the scroll position and closest anchor. The models reducer reacts to this by setting
    // the current model and scene based on the model or scene matching the anchor.
    // Also set the distance from the scroll position to the closest anchor, previous anchor, and next anchor.
    // These distances are used to calculate the vertical transition animation from one model to the next if the
    // anchors represent different models (as opposed to different scenes)
    else if (action.type==actions.REGISTER_SCROLL_POSITION) {
        const scrollPosition = action.position
        // Filter out anchors with an undefined name, meaning they didn't match anything in our initial state
        // If a is closer the function will return <0, so a wins. If b is closer then >0 so b wins
        const {current, next, previous, nextForDistinctModel, previousForDistinctModel} = getRelevantAnchors(scrollPosition)

        return state
            .setIn(['entries', currentDocumentKey, 'scrollPosition'], scrollPosition)
            .setIn(['entries', currentDocumentKey, 'closestAnchors'], Map({
                current,
                previous,
                next,
                previousForDistinctModel,
                nextForDistinctModel
            }))
    }
    /***
     * If incrementing the scroll position to the anchor of the next model
     */
    else if (action.type==actions.SCROLL_TO_NEXT_MODEL) {
        // Get the current scroll position
        const scrollPosition = state.getIn(['entries', currentDocumentKey, 'scrollPosition'])
        const {nextForDistinctModel} = getRelevantAnchors(scrollPosition)
        // Update it to that of the anchor of the next distinct model
        // Scroll up a tad to make it look better
        if (nextForDistinctModel)
            return state.setIn(['entries', currentDocumentKey, 'scrollPosition'], nextForDistinctModel.offsetTop - 30)
    }
    /***
     * If decrementing the scroll position to the anchor of the position model
     */
    else if (action.type==actions.SCROLL_TO_PREVIOUS_MODEL) {
        // Get the current scroll position
        const scrollPosition = state.getIn(['entries', currentDocumentKey, 'scrollPosition'])

        // The scroll up button goes first scene of the previous model (or current model if
        // there is no previous)
        const {previousForDistinctModel, previous} = getRelevantAnchors(scrollPosition)
        const whichPrevious = previousForDistinctModel || previous
        const modelKey = resolveModelKeyFromAnchor(whichPrevious)
        const anchors = getAnchors()
        // Start at 0 and search up until whichPrevious. Take the first model match
        const firstSceneOfPrevious = anchors.slice(0, anchors.indexOf(whichPrevious)+1).find(function(anchor) {
            const seek = resolveModelKeyFromAnchor(anchor)
            return seek==modelKey
        })
        // Scroll to the previous model. Adjust a tad to make it look better
        if (firstSceneOfPrevious) {
            return state.setIn(['entries', currentDocumentKey, 'scrollPosition'], firstSceneOfPrevious.offsetTop - 30)
        }
    }
    else if (action.type == actions.TOGGLE_DOCUMENT_TABLE_OF_CONTENTS) {
        return state.setIn(
            ['entries', action.key, 'tableOfContentsIsExpanded'],
            action.force != null ? action.force : !state.getIn(['entries', action.key, 'tableOfContentsIsExpanded']))
    }
    else
        return state


    function getAnchors() {
        const currentDocumentKey = state.get('current')
        return (state.getIn(['entries', currentDocumentKey, 'anchors'])
            .filter(anchor=>anchor.name != 'undefined') || List([]));
    }

    /***
     * Gets the current, previous, next, nextForDistinctModel, and previousForDistinct model
     * anchors, based on the given scrollPosition, which normally corresponds to the actual
     * scroll position in the document
     * @param scrollPosition
     * @returns {{current: *, previous: *, next: *, nextForDistinctModel: *, previousForDistinctModel: *}}
     */
    function getRelevantAnchors(scrollPosition) {
        const anchors = getAnchors()
        // Current anchor is the last anchor whose position is absolutely closest to the scroll position.
        const current = anchors.sort((a, b) =>
            Math.abs(scrollPosition-a.offsetTop) - Math.abs(scrollPosition-b.offsetTop)).first()

        // The next anchor is the next in the list
        const nextAnchorIndex = anchors.indexOf(current) + 1
        const next = nextAnchorIndex < anchors.count() ? anchors.get(nextAnchorIndex) : null
        // We also need to find the next anchor key of a unique model if one exists.
        // This might be the same as next or different if next is a different scene but the same model
        // as current
        const nextForDistinctModel = findForDistinctModel(
            anchors.slice(next ? nextAnchorIndex : 0),
            current
        )

        // The previous anchor is the next positive one
        const previousAnchorIndex = anchors.indexOf(current) - 1
        const previous = previousAnchorIndex >= 0 ? anchors.get(previousAnchorIndex) : null
        // We also need to find the previous anchor key of a unique model if one exists.
        // This might be the same as previous or different if previous is a different scene but the same model
        // as current
        const previousForDistinctModel = findForDistinctModel(
            anchors.slice(0, previous ? previousAnchorIndex+1 : 0).reverse(),
            current
        )

        console.log(`Scroll Position: ${scrollPosition}`)
        function nameAndPosition(anchor) {
            return `${anchor.name} ${anchor.offsetTop}`
        }
        console.log(`Previous Distinct: ${previousForDistinctModel && nameAndPosition(previousForDistinctModel)}`)
        console.log(`Previous: ${previous && nameAndPosition(previous)}`)
        console.log(`Current: ${current && nameAndPosition(current)}`)
        console.log(`Next: ${next && nameAndPosition(next)}`)
        console.log(`Next Distinct: ${nextForDistinctModel && nameAndPosition(nextForDistinctModel)}`)
        return {current, previous, next, nextForDistinctModel, previousForDistinctModel}
    }

    /***
     * Finds the first anchor in the list with a model distinct from that of defaultAnchor.
     * If no anchor is found that has a different anchor than defaultAnchor, defaultAnchor is returned
     * @param anchors: The anchors to search sequentioall
     * @param defaultAnchors
     * @returns {*}
     */
    function findForDistinctModel(anchors, defaultAnchor) {
        const defaultModelKey = resolveModelKeyFromAnchor(defaultAnchor)
        const forDistinctModel = anchors.find(function (anchor) {
            const seek = resolveModelKeyFromAnchor(anchor)
            if (seek != 'undefined' && seek != defaultModelKey)
                return true
        })
        return forDistinctModel || defaultAnchor
    }

    function resolveModelKeyFromAnchor(anchor) {
        return anchor && anchor.name ? anchor.name.split('_')[0] : null
    }
}

