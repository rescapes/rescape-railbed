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

import {List, Map} from 'immutable';
import {SET_STATE} from '../actions/site'
import * as actions from '../actions/model'
import {DOCUMENT_TELL_MODEL_ANCHOR_CHANGED} from '../actions/site'
import Statuses from '../statuses'
import {normalizeKeyToFilename} from '../utils/fileHelpers'

/***
 * Reduces the state of the models and their media
 * @param state:
 *  {
 *      keys: [],
 *      current: null,
 *      previous: null,
 *      next: null,
 *      baseUrl: null,
 *      baseVideoUrl: null,
 *      entries: {
 *      }
 *  } (default): No model is loaded and no model has stored state
 *  {
 *   keys: [known model keys],
 *   current: model key of the current model,
 *   previous: model key of the previous model if the previous anchor element relative to the document scroll position
 *      represents a different model (not just a different scene)
 *   next: model key of the next model if the next anchor element relative to the document scroll position
 *      represents a different model (not just a different scene)
 *   baseUrl: base url of the models, the model id completes the url
 *   baseVideoUrl: base video url of the models, the model key completes the url
 *   entries: {
 *      model key: {
 *         status: on of actions.Statuses
 *         url: the complete url of the 3d model
 *         videoUrl: the complete video url of the 3d model
 *         scenes: {
 *            keys: [known scene keys of the model] 
 *            current: the current scene of this model
 *            entries: {
 *              scene key: {
 *              
 *              }
 *            }
 *         }
 *         media: {
 *            keys: [known media of the model]
 *            selected: the selected media of the model, if any
 *            entries: {
 *               medium key: {
 *               }
 *            }
 *         }
 *         url: the url of the model, formed by combining the key with a base url
 *         url2d: the 2d url of the model, formed by combining the key with a base url
 *      }
 *      ...
 *   }
 * }
 * @param action
 * @returns {*}
 */
export default function(state = Map({keys: List(), current: null, entries: Map({})}), action) {
    switch (action.type) {
        // If setting state
        case SET_STATE:
            return state.merge(action.state.get('models'));
        
        // Registers a 3D model when discovered by model key in the DOM.
        // If a model is already registered nothing changes
        case actions.REGISTER_MODEL:
            // TODO this never happens since we don't find models in the DOM, they are in initialState
            return (!state.get('keys').has(action.key)) ?
                state
                    // add the model key to the result array
                    .updateIn(['keys'], list=>list.push(action.key))
                    // merge the entry into the entries
                    .mergeDeep({entries: { 
                        [action.key] : {
                            // status is initialized, nothing is loaded yet
                            status: Statuses.INITIALIZED,
                        }}}):
                        state;
        // Shows the given model by making it the current model
        case actions.SHOW_MODEL:
            return state.set('current', action.key);
        // Triggers loading of a model
        case actions.LOAD_MODEL:
            // We can't use spaces in our file names, it confuses babel or webpack or something
            const file = normalizeKeyToFilename(action.key)
            return state.mergeDeep({entries: { [action.key] : {
                status: Statuses.LOADING,
                url: action.url,
                url2d: action.url2d,
                // Full url combines the baseUrl with the key
                // TODO this belongs in some sort of initialize model
                videoUrl: state.get('baseVideoUrl')(file),
            }}})
        // Upon loading indicates the model is ready for interaction
        case actions.RECEIVE_MODEL:
            return state.setIn(['entries', action.key, 'status'], Statuses.READY);
        // Upon load error makes the model unavailable for interaction with reload option
        case actions.MODEL_ERRED:
            return state.setIn(['entries', action.key, 'status'], Statuses.ERROR);

        // Respond to the document's current, previous, previousForDistinctModel, and nextForDistinctModel
        // anchor to the scroll position changing by updating the current model and scene of models
        case DOCUMENT_TELL_MODEL_ANCHOR_CHANGED:
            return ['current', 'previous', 'next', 'previousForDistinctModel', 'nextForDistinctModel']
                .reduce(function(state, anchorKey) {

                const anchor = action.anchors.get(anchorKey)
                if (!anchor)
                    return state;
                // Get the name of the anchor and look for an _, which divides the modelKey from sceneKey if
                // a scene is associated with the anchor. Otherwise the anchor represents the entire model
                const [modelKey, sceneKey] = anchor && anchor.name ? anchor.name.split('_') : null
                if (anchorKey=='current')
                    console.log(`Model: ${modelKey} Scene: ${sceneKey || anchor.id}`)
                // If there is no anchor don't change state
                if (!modelKey || modelKey == 'undefined')
                    return state;
                // Store the current, previous or next model key. Only store previous/next if they are different
                // than the current model.
                // Optionally store the scene key of the current model (we don't care what the scene is of
                // the previous and next models)
                if (anchorKey == 'current') {
                    return state
                        .set(anchorKey, modelKey)
                        .setIn(['entries', modelKey, 'scenes', anchorKey], sceneKey || null)
                }
                // previous, next, previousForDistinctModel, nextForDistinctModel
                else if (modelKey != state['current']) {
                    return state.set(anchorKey, modelKey)
                }
                else
                    return modelSetState
            }, state)
        default:
            return state
    }
}
