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
import * as modelActions from '../actions/model'
import Statuses from '../statuses'
import config from '../config'

/***
 * Reduces the state of the documents
 * @param state:
 * {
 *      keys: [],
 *      current: null,
 *      baseUrl: null,
 *      postUrl: null,
 *      location: null,
 *      entries: {
 *      }
 *  } (default): The documents is not loaded 
 *  {
 *   keys: [known documents keys],
 *   current: documents key of the current model,
 *   baseUrl: base url of the documents, the url of the entry completes the url
 *   siteUrl: base url of the blog site, the postUrl of the entry completes the url
 *   location: The Router location object, used for reading the presence of a hash in the URL
 *   entries: {
 *      [documents key]: {
 *         status: one of Statuses
 *         name: name of the document
 *         url: Url of a publicly available document (e.g. from Google Drive)
 *         postUrl: Url of the blog post (e.g. http://rescapes.net/the_amtrak_standard)
 *         title: The title of the document
 *         isHeaderDocument: true for documents like about and contact
 *         content: The loaded content of the document
 *         models: [the model keys of the document]
 *      }
 *  }
 * @param action
 * @returns {*}
 */
export default function(state = Map({keys: List(), current: null, entries: Map({})}), action) {
    // Work in the context of the main Document or the overlay Document if the latter is showing
    const currentDocumentKey = state.get('currentOverlay') || state.get('current')

    /***
     * Used by two reduces to register the current scroll position and find the closest anchors
     * @param documentKey
     * @param scrollPosition
     * @returns {*}
     */
    var setScrollPosition = function (documentKey, scrollPosition) {

        // Filter out anchors with an undefined name, meaning they didn't match anything in our initial state
        // If a is closer the function will return <0, so a wins. If b is closer then >0 so b wins
        const {current, next, previous, nextForDistinctModel, previousForDistinctModel} = getRelevantAnchors(scrollPosition)

        return state
            .setIn(['entries', documentKey, 'scrollPosition'], scrollPosition)
            .setIn(['entries', documentKey, 'closestAnchors'], Map({
                current,
                previous,
                next,
                previousForDistinctModel,
                nextForDistinctModel
            }))
    };

    // If setting state we will receive the full state
    if (action.type==SET_STATE) {
        return state.merge(action.state.get('documents'));
    }
    // Sets the document to be the current one
    // Also sets up the siteUrl of the document for use in social media links, etc
    // if action.options.isOverlay is specified, this instead makes the document
    // and overlay over the current document. Used for about, contact, etc pages
    else if (action.type==actions.SHOW_DOCUMENT) {
        if (action.options && action.options.isOverlay) {
            // When we show an overlay document set the scroll position to 0
            return setScrollPosition(action.key, 0)
                .set('currentOverlay', action.key)
                .setIn(['entries', action.key, 'postUrl'], state.get('siteUrl')(action.key))
        }
        else {
            return state
                .set('current', action.key)
                .setIn(['entries', action.key, 'postUrl'], state.get('siteUrl')(action.key))
        }
    }
    // If an overlay Document is showing, close it.
    else if (action.type == actions.CLOSE_OVERLAY_DOCUMENT) {
        return state.set('currentOverlay', null)
    }
    // Stores the router's location object
    else if (action.type==actions.SET_DOCUMENT_LOCATION) {
        return state.set('location', action.location)
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
        // for anchors representing models or groups of models.
        // The anchorToModels are an OrderedMap representation of these
        // The sceneAnchors are a flat array of pseudo-anchors representing the position of each scene of each model
        // all of the <a id=...> tags it finds. These represent anchors to the models
        // or their scenes.
        return state
            .setIn(['entries', currentDocumentKey, 'anchorToModels'], action.anchorToModels)
            .setIn(['entries', currentDocumentKey, 'anchors'], action.sceneAnchors)
    }
    // Sets the scroll position and closest anchor. The models reducer reacts to this by setting
    // the current model and scene based on the model or scene matching the anchor.
    // Also set the distance from the scroll position to the closest anchor, previous anchor, and next anchor.
    // These distances are used to calculate the vertical transition animation from one model to the next if the
    // anchors represent different models (as opposed to different scenes)
    // The scrollPosition is recording in the state of the Document or the OverlayDocument if the latter is showing
    else if (action.type==actions.REGISTER_SCROLL_POSITION) {
        return setScrollPosition(currentDocumentKey, action.position)
    }
    /**
     * Tracks if we are actively scrolling to a model.
     * This disables things like video scene changes until the scrolling completes.
     */
    else if (action.type==actions.DOCUMENT_IS_SCROLLING) {
        return state .setIn(['entries', currentDocumentKey, 'isScrolling'], action.isScrolling)
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
        const anchors = getAnchors(currentDocumentKey)
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
    /***
     * Handles and action to scroll to the given model
     */
    else if (action.type==actions.SCROLL_TO_MODEL) {
        const document = state.getIn(['entries', currentDocumentKey])
        // Get the current scroll position
        const scrollPosition = document.get('scrollPosition')
        const {previousForDistinctModel, previous} = getRelevantAnchors(scrollPosition)
        // Use the model anchor
        const soughtModelAnchorModels = document.get('anchorToModels').entrySeq().find(([anchor, models]) =>
            anchor.get('name') == action.key
        )
        if (!soughtModelAnchorModels) {
            console.error `The anchor with name ${action.key} does not exist`
            return
        }

        const soughtModelAnchor = soughtModelAnchorModels[0]
        // Update it to that of the anchor of the next distinct model
        // Scroll up a tad to make it look better
        return state.setIn(
            ['entries', currentDocumentKey, 'scrollPosition'],
            soughtModelAnchor.get('offsetTop') - config.SCROLL_OFFSET
        )
    }
    // Toggle comments showing or hidden for the current document
    else if (action.type == actions.TOGGLE_DOCUMENT_COMMENTS) {
        return state.setIn(
            ['entries', action.key, 'commentsAreShowing'],
            action.force != null ? action.force : !state.getIn(['entries', action.key, 'commentsAreShowing'])
        ).setIn(['entries', action.key, 'commentsHaveShown'], true)
    }
    // Toggle off document comments if model comments are toggled on
    else if (action.type == modelActions.TOGGLE_MODEL_COMMENTS) {
        if (action.force)
            return state.setIn(
                ['entries', state.get('current'), 'commentsAreShowing'],
                false
            )
        return state
    }

    /***
     * Handles and action to exapnd or collapse the table of contents.
     * An optional argument of isHover is stored to determine whether expandsion is based on a hover rather than
     * a click
     */
    else if (action.type == actions.TOGGLE_DOCUMENT_TABLE_OF_CONTENTS) {
        const currentValue = state.getIn(['entries', action.key, 'tableOfContentsIsExpanded'])
        const expandedByHover = state.getIn(['entries', action.key, 'tableOfContentIsExpandedByHover'])

        // If the state is expanded by click and we are trying to expand/collapse with a hover-on/off, ignore
        if (action.isHover && currentValue && !expandedByHover)
            return state
        // If we click after hovering expanded it, then keep it expanded (lock) but switch tableOfContentsIsExpandedByHover
        if (!action.isHover && currentValue && expandedByHover)
            return state.setIn(
                ['entries', action.key, 'tableOfContentIsExpandedByHover'],
                false)
        // If we click a second time to unlock but keep expanded since the hover will now control it
        if (!action.isHover && currentValue && !expandedByHover)
            return state.setIn(
                ['entries', action.key, 'tableOfContentIsExpandedByHover'],
                true)

        const value = action.force != null ?
            action.force :
            !currentValue

        return state.setIn(
            ['entries', action.key, 'tableOfContentsIsExpanded'],
            value).setIn(
            ['entries', action.key, 'tableOfContentIsExpandedByHover'],
            value && !!action.isHover)
    }
    else
        return state


    /***
     * Gets the anchors of the given document
     * @param documentKey
     * @returns {*}
     */
    function getAnchors(documentKey) {
        return (state.getIn(['entries', documentKey, 'anchors']) ||[]).filter(anchor=>anchor.name != 'undefined')
    }

    /***
     * Gets the current, previous, next, nextForDistinctModel, and previousForDistinct model
     * anchors, based on the given scrollPosition, which normally corresponds to the actual
     * scroll position in the document
     * @param scrollPosition
     * @param documentKey The current document
     * @returns {{current: *, previous: *, next: *, nextForDistinctModel: *, previousForDistinctModel: *}}
     */
    function getRelevantAnchors(scrollPosition, documentKey) {
        documentKey = documentKey || currentDocumentKey
        const anchors = getAnchors(documentKey)
        if (!anchors.length)
            return {}
        // Current anchor is the last anchor whose position is absolutely closest to the scroll position.
        const current = anchors.slice(0).sort((a, b) =>
            Math.abs(scrollPosition-a.offsetTop) - Math.abs(scrollPosition-b.offsetTop))[0]

        // The next anchor is the next in the list
        const nextAnchorIndex = anchors.indexOf(current) + 1
        const next = nextAnchorIndex < anchors.length ? anchors[nextAnchorIndex] : null
        // We also need to find the next anchor key of a unique model if one exists.
        // This might be the same as next or different if next is a different scene but the same model
        // as current
        const nextForDistinctModel = findForDistinctModel(
            anchors.slice(next ? nextAnchorIndex : 0),
            current
        )

        // The previous anchor is the next positive one
        const previousAnchorIndex = anchors.indexOf(current) - 1
        const previous = previousAnchorIndex >= 0 ? anchors[previousAnchorIndex] : null
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
     * @param anchors: The anchors to search sequentially
     * @param defaultAnchor: If specified the anchor of the current model. Returned if no distinc model is found
     * @param seekModelKey: If specified find the anchor of the model matching this key
     * @returns {*}
     */
    function findForDistinctModel(anchors, defaultAnchor, seekModelKey) {
        const defaultModelKey = defaultAnchor ? resolveModelKeyFromAnchor(defaultAnchor) : null
        const forDistinctModel = anchors.find(function (anchor) {
            const seek = resolveModelKeyFromAnchor(anchor)
            if (seek != 'undefined' && seek != defaultModelKey && (!seekModelKey || seek == seekModelKey))
                return true
        })
        return forDistinctModel || defaultAnchor
    }

    function resolveModelKeyFromAnchor(anchor) {
        return anchor && anchor.name ? anchor.name.split('_')[0] : null
    }
}

