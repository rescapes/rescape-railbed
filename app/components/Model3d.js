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
import Iframe from './Iframe'
import * as actions from '../actions/model'
import * as settingsActions from '../actions/settings'
import Statuses from '../statuses'
import {Map} from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ModelVideo from './ModelVideo'
import {currentSceneKeyOfModel, currentSceneOfModel} from '../utils/modelHelpers'
import load_3d_png from '../images_dist/load3d-320.png'


// This garbage has to be done to force webpack to know about all the media files
var req = require.context('../videos/', true, /\.(mp4)$/)
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
            this.changeScene(sceneKey)
    }

    /***
     * If the current, previous, or next model changes, fetch them if needed
     * which just sets the url so the 3d model or video can load.
     * This also closes the comments window if the current model changes by telling the current/previous/next models
     * to toggle off showing comments
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        const nextModels = nextProps.models,
            models = this.props.models;
        if (!models)
            return

        ['current', 'previousForDistinctModel', 'nextForDistinctModel'].forEach(function(key) {
            if (!nextModels || (nextModels.get(key) != models.get(key))) {
                const modelKeyToLoad = (nextModels || models).get(key)
                if (modelKeyToLoad)
                    this.props.fetchModelIfNeeded(modelKeyToLoad)
                // Make sure comments are off if we are switching models
                this.props.toggleModelComments(models.get(key), false)
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
        if (props.modelTops.next || 0 > this.props.modelTops.next || 0) {
           this.setState({scrollDirection: 'forward'})
        }
        else if (props.modelTops.previous || 0 > this.props.modelTops.previous || 0) {
            this.setState({scrollDirection: 'backward'})
        }
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

        if (this.is3dSet(model)) {
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
     *
     * If defined on the model, use its 3d setting, otherwise default to the settings
     * @param model
     */
    is3dSet(model) {
        return model.get('is3dSet')===true || model.get('is3dSet')===false ? model.get('is3dSet') : this.props.defaultIs3dSet
    }

    /***
     * When no current scene is active or when the model first loads in the iframe, go to the first scene
     * TODO. Not sure if this is needed since a loaded model has a default camera view
     */
    firstScene() {
        document.querySelectorAll('div.viewer-scene-option')[0].click()
    }

    /***
     * Enable or disable 3d for the current model. Enabled means that Sketchup loads. Disabled means a video loads
     * Returns a bound function with forced closed
     */
    bindToggle3d(force) {
        return function() {
            this.props.toggleModel3d(this.props.modelKey, force)
        }.bind(this)
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

        // Maintain an iframe for each model. Only the iframe of the current model is ever visible.
        // We don't want to set the url of the iframe until it is desired to load a certain model
        // (e.g. when it is the current model or about to become the current one)
        // Once the model is loaded, we never want to unload it by clearing its URL
        const iframes = (modelLoadingOrReady && modelEntries) ? modelEntries.map(function (iterModel, modelKey) {
            const status = iterModel.get('status')
            const isAlreadyLoaded = !!(status & loadingOrReady)
            const isCurrentModel = model == iterModel
            const modelRelevance = Map({
                current: isCurrentModel,
                previous: !isCurrentModel && modelKey == models.get('previous'),
                next: !isCurrentModel && modelKey == models.get('next'),
            })
            // Node the relevance if any
            const relevance = modelRelevance.findKey((value, key)=>value) || null


            // When the previous/next model anchor is closer than the current, we want to show the closer
            // model above/below the current model to create a scroll-controlled transition effect
            const divClass = `model-3d ${relevance || ''} `.trim()
            var divStateClass = null
            if (relevance == 'current') {
                // Track whether the current is on its own or showing with previous or next
                // We do this just to animate the transit of the 'top' property
                divStateClass = modelTops['previous'] || modelTops['next'] ? 'duo' : 'solo'
            }
            else {
                // Otherwise see if the previous or next is visible
                // We do this just to animate the transit of the 'top' property
                divStateClass = modelTops[relevance] ? 'active' : 'inactive'
            }

            // If this iframe has relevance then set the top style to the percent of relevance
            const style = relevance && modelTops[relevance] ? {
                top: `${Math.round(modelTops[relevance]*100)}%`,
            } : {}


            // Determine whether to show the 3d model or video
            let model3dPresentation = null
            const is3dSet = this.is3dSet(iterModel)
            if (is3dSet) {
                // If it's already loaded, current, or in the loading queue (previous or next model), set the URL
                // Setting the url of the iframe forces it to load if not yet loaded
                // TODO. We should add more intelligence to not load next/previous until current is fully loaded
                const url = iterModel.get('url')
                const iframeUrl = (isAlreadyLoaded || relevance) ? url : null
                model3dPresentation = <Iframe key={modelKey}
                        src={iframeUrl}
                        name={`iframe_${modelKey}`}
                        onLoad={this.frameDidLoad.bind(this)}
                />
            }
            else {
                // The videoUrl is that of the current model
                const videoUrl = iterModel.get('videoUrl')
                const scene =  currentSceneOfModel(iterModel)
                // Get the time to play the video to transition from one scene to the next
                const sceneTransitionTime = iterModel.get('sceneTransitionTime') || this.props.settings.get('SCENE_TRANSITION_TIME')
                const sceneIndex = (iterModel.getIn(['scenes', 'entries']) || Map()).toArray().indexOf(scene)
                // We need to transition from the last scene (or position) to the current scene
                const start = (sceneIndex-1 >= 0 ? sceneIndex-1 : 0) * sceneTransitionTime,
                      end = (sceneIndex >=0 ? sceneIndex : 0) * sceneTransitionTime
                model3dPresentation = <ModelVideo videoUrl={videoUrl} start={start} end={end} scrollDirection={this.state.scrollDirection}
                >
                </ModelVideo>
            }

            // Return the iframe or video wrapped in a div. The div must have a unique key for React
            return <div key={modelKey} className={`${divClass} ${divStateClass}`} style={style}>
                <img className='toggle-3d' src={load_3d_png} onClick={this.bindToggle3d(!is3dSet)} />
                { model3dPresentation }
                <div className='model-3d-gradient left'/>
                <div className='model-3d-gradient right'/>
                <div className='model-3d-gradient top'/>
                <div className='model-3d-gradient bottom'/>
            </div>
        }, this).toArray() : [];

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
    modelKey: PropTypes.string,
    is3dSet: PropTypes.bool,
    sceneKey: PropTypes.string,
    // This is from the parent, not the state
    modelTops: PropTypes.object
}

function mapStateToProps(state) {
    const settings = state.get('settings')
    const documentKey = state.getIn(['documents', 'current'])
    const models = documentKey && state.get('models')
    const defaultIs3dSet = state.getIn(['settings', settingsActions.SET_3D])
    // Pass modelKey and sceneKey so that React recalculates the current
    // scene when it changes
    const modelKey = models.get('current')
    // Note if 3d is set for the current model
    const is3dSet = models.getIn(['entries', modelKey, 'is3dSet'])
    const sceneKey = currentSceneKeyOfModel(models.getIn(['entries', modelKey]))

    return {
        settings,
        models,
        defaultIs3dSet,
        sceneKey,
        is3dSet
    }
}

export default connect(
    mapStateToProps,
    Object.assign(actions, settingsActions)
)(Model3d)

