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
 *      entries: {
 *      }
 *  } (default): The documents is not loaded 
 *  {
 *   keys: [known documents keys],
 *   current: documents key of the current model,
 *   baseUrl: base url of the documents, the url of then entry completes the url
 *   entries: {
 *      [documents key]: {
 *         status: one of Statuses
 *         name: name of the document
 *         url: Url of a publicly available document (e.g. from Google Drive)
 *         title: The title of the document
 *         content: The loaded content of the document
 *         models: [the model keys of the document]
 *      }
 *  }
 * @param action
 * @returns {*}
 */
export default function(state = Map({keys: List(), current: null, entries: Map({})}), action) {
    switch (action.type) {
        // If setting state we will receive the full state
        case SET_STATE:
            return state.merge(action.state.get('documents'));
        // Sets the document to be the current one
        case actions.SHOW_DOCUMENT:
            return state.set('current', action.key);
        case actions.REGISTER_DOCUMENT:
            return (!state.get('keys').has(action.key)) ?
                state
                // add the model key to the result array
                    .updateIn(['keys'], list=>list.push(action.key))
                    // merge the entry into the entries
                    .mergeDeep({entries: {
                        [action.key] : {
                            key: action.key,
                            // status is initialized, nothing is loaded yet
                            status: Statuses.INITIALIZED,
                        }}}):
                state;
        // Indicates that the load of the documents has begun
        case actions.LOAD_DOCUMENT:
            return state.mergeDeep({entries: { [action.key] : {
                status: Statuses.LOADING,
                url: action.url
            }}})
        // Upon loading indicates the model is ready for interaction
        case actions.RECEIVE_DOCUMENT:
            return state
                // merge the entry's content
                .mergeDeep({entries: {
                    [action.key] : {
                        // status is initialized, nothing is loaded yet
                        status: Statuses.READY,
                        content: action.content
                    }}})
        case actions.DOCUMENT_ERRED:
            return state.setIn(['entries', action.key, 'status'], Statuses.ERROR);
        
        // When the document is fully loaded our Component inspects its DOM and sends
        // all of the <a id=...> tags it finds. These represent anchors to the models
        // or their scenes.
        case actions.REGISTER_ANCHORS:
            return state.setIn(['entries', state.get('current'), 'anchors'], action.anchors)
        // Sets the scroll position and closest anchor. The models reducer reacts to this by setting
        // the current model and scene based on the model or scene matching the anchor
        case actions.REGISTER_SCROLL_POSITION:
            const scrollPosition = action.position
            // Sort based on which anchor is closest to the scrollPosition
            // If a is closer the function will return <0, so a wins. If b is closer then >0 so b wins
            const currentKey = state.get('current')
            const sortedAnchors = (state.getIn(['entries', currentKey, 'anchors']) || List([])).sort((a, b) => Math.abs(scrollPosition-a.offsetTop) - Math.abs(scrollPosition-b.offsetTop))
            console.log(sortedAnchors.first())
            return state
                .setIn(['entries', state.get('current'), 'scrollPosition'], scrollPosition)
                .setIn(['entries', state.get('current'), 'closestAnchor'], sortedAnchors.first() || null)
        default:
            return state
    }
}
