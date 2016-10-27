/**
 * Created by Andy Likuski on 2016.06.01
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import * as actions from '../actions/model'
import * as documentActions from '../actions/document'
import * as settingsActions from '../actions/settings'
import Statuses from '../statuses'
import {Map} from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ModelAndVideo from './ModelAndVideo'
import {currentSceneKeyOfModel, checkIf3dSet} from '../utils/modelHelpers'
import {isSeeking} from '../utils/documentHelpers'

// This garbage has to be done to force webpack to know about all the media files
var req = require.context('../videos/', true, /\.(webm)$/)
req.keys().forEach(function(key){
    req(key);
})

class Model3d extends Component {
    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.setState({scrollDirection: null})
    }

    /***
     * As soon as the component mounts we want to show the closest 3d model to the scroll position of the
     * text. It could be any 3d model since the URL loaded might have an anchor
     */
    componentDidMount() {
        const {dispatch, url} = this.props
        if (this.refs.iframe)
            this.refs.iframe.getDOMNode().addEventListener('load', this.frameDidLoad);

        // Load the current, previous, and next models
        // These might all be present depending on the position at which we loaded the document
        const models = this.props.models
        if (!models)
            return
        ['current', 'previousForDistinctModel', 'nextForDistinctModel'].forEach(function(key) {
            const modelKeyToLoad = models.get(key)
            if (modelKeyToLoad)
                this.props.fetchModelIfNeeded(modelKeyToLoad)
        }, this)

        this.updateState(this.props)
    }

    componentDidUpdate() {
    }

    /***
     * Call the receive action when the frame loads
     * TODO this is firing too early. We need it to fire when the embedded model if fully loaded
     * We probably need to check the status of the 3d model network resource or tap into the js of the loader code
     * @param event
     */
    frameDidLoad(event) {
        this.props.receiveModel(this.props.modelKey)
        const sceneKey = this.currentSceneKey()
        // Once loaded change the scene if one is specified
        if (sceneKey)
            this.changeScene(this.props.model, sceneKey)
    }

    /***
     * If the current, previous, previousForDistinctModel, next, or nextForDistinctModel model changes,
     * fetch them if needed, which just sets the url so the 3d model or video can load.
     * Some of these keys will point to the same model, that's okay
     * This also closes the comments window if the current model changes by telling the current/previous/next models
     * to toggle off showing comments
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        const nextModels = nextProps.models,
            models = this.props.models;
        if (!models)
            return

        ['current', 'previous', 'next', 'previousForDistinctModel', 'nextForDistinctModel'].forEach(function(key) {
            if (!nextModels || (nextModels.get(key) != models.get(key))) {
                const modelKeyToLoad = (nextModels || models).get(key)
                if (modelKeyToLoad)
                    this.props.fetchModelIfNeeded(modelKeyToLoad)
                // Make sure comments are off for the current model and the documnet if we are changing current
                if (key=='curent') {
                    this.props.toggleModelComments(models.get(key), false)
                    this.props.toggleDocumentComments(this.props.documentKey, false)
                }
            }
        }, this)

        this.updateState(nextProps, nextModels)
    }
    /***
     * Check for a prop change to model, if so fetch the model if needed. render will set the ifram to the model's url
     * @param props
     */
    updateState(props, nextModels) {

        // Set the current model and scene
        const nextModelKey = props.modelKey
        const modelChanged = this.props.modelKey != nextModelKey
        const sceneKey = this.currentSceneKey()
        const nextSceneKey = props.model && props.model.getIn(['scenes', 'current'])
        // If the model changed or the scene changed
        // and the next model has a READY status, we can also set the scene to the current scene calling
        // an action on the scene panel within the iframe. Otherwise we set the scene in frameDidLoad
        if (nextModelKey && nextSceneKey &&
            props.model.get('status') == Statuses.READY &&
            (modelChanged || sceneKey != nextSceneKey)) {
            this.changeScene(props.model, nextSceneKey)
        }

        // Figure out if we are scrolling forward or backward based on model state
        const direction = (props.scrollPosition || 0) - (this.props.scrollPosition || 0)
        if (direction > 0)
           this.setState({scrollDirection: 'forward'})
        else if (direction < 0)
            this.setState({scrollDirection: 'backward'})
        else
            this.setState({scrollDirection: null})
    }

    /***
     * Returns the current scene key of the current model
     */
    currentSceneKey() {
        return this.props.model && this.props.model.getIn(['scenes', 'current'])
    }


    /***
     * Changes the scene of the 3D model in the iframe to the scene with the given key
     * @param model
     * @param sceneKey
     */
    changeScene(model, sceneKey) {

        if (checkIf3dSet(model, this.props.defaultIs3dSet)) {
            // TODO not working do to cross domain security
            const dom = ReactDOM.findDOMNode(this).children['iframe']
            if (!dom)
                return
            const sceneDiv = dom.querySelectorAll(`div.viewer-scene-option[title="${sceneKey}"]`)[0]
            if (sceneDiv) {
                sceneDiv.click()
            }
        }
        else {

        }
    }

    /***
     * Renders the model in an iframe. By setting the url we commence model loading here
     * @returns {XML}
     */
    render() {
        const settings = this.props.settings
        if (!settings)
            return <div/>
        const models = this.props.models
        const modelEntries = models && models.get('entries')
        const model = this.props.model
        const loadingOrReady = Statuses.LOADING | Statuses.READY
        const modelLoadingOrReady = model && (model.get('status') & loadingOrReady)
        const modelTops = this.props.modelTops

        // Maintain an iframe (Sketchup) or div (video )for each model.
        // Only the iframe of the current model is ever visible.
        // We don't want to set the url of the iframe or video until it is desired to load a certain model
        // (e.g. when it is the current model or about to become the current one)
        // Once the model is loaded, we never want to unload it by clearing its URL
        const iframes = (modelLoadingOrReady && modelEntries) ? modelEntries.map((iterModel, modelKey) =>
            <ModelAndVideo model={iterModel} models={models} modelKey={modelKey} modelTops={modelTops} currentModel={model} scrollDirection={this.state.scrollDirection}/>, this
        ).toArray() : [];

        // Our final product is the list of iframes. All have the same styling except that only
        // the one of the current model is visible
        return <div className="model-3ds">
            {iframes}
        </div>
    }

}

Model3d.propTypes = {
    settings: ImmutablePropTypes.map,
    models: ImmutablePropTypes.map,
    defaultIs3dSet: PropTypes.bool,
    documentKey: PropTypes.string,
    scrollPosition: PropTypes.number,
    modelKey: PropTypes.string,
    is3dSet: PropTypes.bool,
    sceneKey: PropTypes.string,
    // This is from the parent, not the state
    modelTops: PropTypes.object,
    isDisabled: PropTypes.bool,
}

function mapStateToProps(state) {
    const settings = state.get('settings')
    const documentKey = state.getIn(['documents', 'current'])
    const document = state.getIn(['documents', 'entries', documentKey])
    const scrollPosition = document.get('scrollPosition')
    const models = documentKey && state.get('models')
    const defaultIs3dSet = state.getIn(['settings', settingsActions.SET_3D])
    // Pass modelKey and sceneKey so that React recalculates the current
    // scene when it changes
    const modelKey = models.get('current')
    // Note if 3d is set for the current model
    const is3dSet = models.getIn(['entries', modelKey, 'is3dSet'])
    const sceneKey = currentSceneKeyOfModel(models.getIn(['entries', modelKey]))
    // Are we currently seeking the desired document position
    const isDisabled = isSeeking(document) || !!state.getIn(['documents', 'currentOverlay'])
    return {
        settings,
        documentKey,
        scrollPosition,
        models,
        defaultIs3dSet,
        sceneKey,
        is3dSet,
        isDisabled
    }
}

export default connect(
    mapStateToProps,
    Object.assign(actions, documentActions, settingsActions)
)(Model3d)

