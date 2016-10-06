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
 * Defines the all actions of the models which contains the current model and the media that accompany the model
 */

import ActionLoader from '../actionLoader'
import {Map} from 'immutable'

/*
 * Action types. See action definition for explanation
*/

// model actions
export const REGISTER_MODEL = 'REGISTER_MODEL'
export const LOAD_MODEL = 'LOAD_MODEL'
export const RECEIVE_MODEL = 'RECEIVE_MODEL'
export const MODEL_ERRED = 'MODEL_ERRED'
export const SHOW_MODEL = 'SHOW_MODEL'

export const TOGGLE_MODEL_COMMENTS = 'TOGGLE_MODEL_COMMENTS'
export const TOGGLE_MODEL_3D = 'TOGGLE_MODEL_3D'

// scene actions--currently unused
export const SHOW_SCENE = 'SHOW_SCENE'
export const FREE_SCENE = 'FREE_SCENE'


/*
 * Action creators. 
 * List in the same order as the action types.
 */

// model actions



class ModelLoader extends ActionLoader {

    constructor() {
        super()
        this.key = 'models'
    }

    /***
     * The baseUrl for the models state has a parameter to accept the model's id
     * @param settings: The global settings
     * @param state: The substate for models
     * @param entry: The models to be loaded
     * @returns {*}
     */
    makeLoadUrl(settings, state, entry) {
        // The last parameter here is blank to indicate a 3D image, as opposed to 2D
        return state.get('baseUrl')(entry.get('id'), '')
    }

    /***
     * Indicates that the models is loading
     * @param url: The url of the model (e.g. the 3D warehouse url)
     * @returns {{type: string, url: *}}
     */
    loadIt(state, key, url) {
        const entry = state.getIn(['models', 'entries', key])
        return {
            type: LOAD_MODEL,
            key,
            url,
            modelCreditUrl: state.getIn(['models', 'baseModelCreditUrl'])(entry.get('id'))
        }
    }

    /***
     * Indicates that the model is being received. 
     * Since the iframe loads the content, the Model3d component will call this when the iframe finishes loading
     * The content is thus always null
     * @param key: The key of the model
     * @param content: The content if there were any
     * @returns {{type: string, url: *, content: *, receivedAt: number}}
     */
    receive(key, content) {
        return {
            type: RECEIVE_MODEL,
            key,
            content: null,
            receivedAt: Date.now()
        }
    }

    /***
     * Indicates that the loading of the model erred
     *
     * @param url: The invariable url of the models
     * @returns {{type: string, key: *}}
     */
    erred(url) {
        return { type: MODEL_ERRED, url }
    }

    /***
     * Override to not actually fetch. We let the iframe do the loading to prevent cross-domain madness.
     * We do nothing here and expect the Model3d code to call our exposed receive method
     * @param dispatch
     * @param entryKey
     * @param url
     */
    fetchIt(dispatch, entryKey, url) {
        // Just fake a receive
        dispatch(this.receive(entryKey, null))
    }


    /***
     * Shows the given 3D model in the given 3D view
     *
     * @param key: The key of the 3D model (e.g. 'denver_train_station')
     * @returns {{type: string, key: *}}
     */
    showIt(key) {
        return { type: SHOW_MODEL, key }
    }
}

/***
 * Toggles the Model3d's is3dSet value
 * @param key: The Model3d key
 * @param force: Force a certain value, true or false
 */
export function toggleModel3d(key, force) {
    return { type: TOGGLE_MODEL_3D, key, force }
}

/***
 * Toggles the Model3d's comments on and off
 * @param key: The Model3d key
 * @param force: Force a certain value, true or false
 */
export function toggleModelComments(key, force) {
    return { type: TOGGLE_MODEL_COMMENTS, key, force }
}

// scene actions

/***
 * Sets the current 3D model to its closest scene based on the user's position in the DOM
 * if FREE_SCENE had been previously called, this relocks to a scene so that subsequent
 * movement by the user in the DOM will change scenes
 *
 * @param modelKey: The model key
 * @param key: The invariable key of a model's scene (e.g. 'elephant_in_the_room')
 * @returns {{type: string, current: *}}
 */
export function showScene(modelKey, key) {
    return { type: SHOW_SCENE, key }
}

/***
 * Frees the current 3d model from changing scenes automatically, instead
 * remaining at the current scene or where the user manually positioned the model
 * @param modelKey: The model key
 * @returns {{type: *, current: *}}
 */
export function freeScene(modelKey) {
    return { type: FREE_SCENE }
}

/*
 * Action types. See action definition for explanation
 */


/*
 * Action creators. 
 * List in the same order as the action types.
 */

/***
 * Register the given unloaded 3D model when encountered in the DOM.
 * This does not load the 3D model since we might want to skip, queue or otherwise delay loading
 *
 * @param key: The invariable key of the model (e.g. 'denver_train_station')
 * @returns {{type: string, key: *}}
 */
export function registerModel(key) {
    return { type: REGISTER_MODEL, key }
}

// Export the public methods of the ModelLoader
const modelLoader = new ModelLoader()
export const showModel = modelLoader.show.bind(modelLoader)
export const fetchModelIfNeeded = modelLoader.fetchIfNeeded.bind(modelLoader)
// We expose this so that we can call it from the Model3d component when the iframe finishes loading
export const receiveModel = modelLoader.receive.bind(modelLoader)
