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
import Statuses from '../statuses'
import {Map} from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'

class Model3d extends Component {
    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }

    /***
     * As soon as the component mounts we want to show the closest 3d model to the scroll position of the
     * text. It could be any 3d model since the URL loaded might have an anchor
     */
    componentDidMount() {
        const {dispatch, url} = this.props
        if (this.refs.iframe)
            this.refs.iframe.getDOMNode().addEventListener('load', this.frameDidLoad);
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
     * Check for a prop change to model, if so fetch the model if needed. render will set the ifram to the model's url
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {

        // If the current, previous, or next model changes, fetch them if needed
        // which currently just sets the url of the model's state so the iframe can load it
        const nextModels = nextProps.models,
              models = this.props.models;
        if (!models)
            return
        ['current', 'previousForDistinctModel', 'nextForDistinctModel'].forEach(function(key) {
            if (!nextModels || (nextModels.get(key) != models.get(key))) {
                const modelKeyToLoad = (nextModels || models).get(key)
                if (modelKeyToLoad)
                    this.props.fetchModelIfNeeded(modelKeyToLoad)
            }
        }, this)

        // Set the current model and scene
        const nextModelKey = nextProps.modelKey
        const modelChanged = this.props.modelKey != nextModelKey
        const sceneKey = this.currentSceneKey()
        const nextSceneKey = nextProps.model && nextProps.model.getIn(['scenes', 'current'])
        // If the model changed or the scene changed
        // and the next model has a READY status, we can also set the scene to the current scene calling
        // an action on the scene panel within the iframe. Otherwise we set the scene in frameDidLoad
        if (nextModelKey && nextSceneKey &&
            nextProps.model.get('status') == Statuses.READY &&
            (modelChanged || sceneKey != nextSceneKey)) {
            this.changeScene(nextSceneKey)
        }
    }

    /***
     * Returns the current scene key of the current model
     */
    currentSceneKey() {
        return this.props.model && this.props.model.getIn(['scenes', 'current'])
    }

    /***
     * Changes the scene of the 3D model in the iframe to the scene with the given key
     * @param sceneKey
     */
    changeScene(sceneKey) {
        const dom = ReactDOM.findDOMNode(this).children['iframe']
        if (!dom)
            return
        const sceneDiv = dom.querySelectorAll(`div.viewer-scene-option[title="${sceneKey}"]`)[0]
        if (sceneDiv) {
            sceneDiv.click()
        }
    }

    /***
     * When no current scene is active or when the model first loads in the iframe, go to the first scene
     * TODO. Not sure if this is needed since a loaded model has a default camera view
     */
    firstScene() {
        document.querySelectorAll('div.viewer-scene-option')[0].click()
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
        const tops = this.tops()

        // Maintain an iframe for each model. Only the iframe of the current model is ever visible.
        // We don't want to set the url of the iframe until it is desired to load a certain model
        // (e.g. when it is the current model or about to become the current one)
        // Once the model is loaded, we never want to unload it by clearing its URL
        const iframes = (modelLoadingOrReady && modelEntries) ? modelEntries.map(function (iterModel, modelKey) {
            const status = iterModel.get('status')
            const url = iterModel.get('url')
            const isAlreadyLoaded = !!(status & loadingOrReady)
            const isCurrentModel = model == iterModel
            const modelRelevance = Map({
                current: isCurrentModel,
                previous: !isCurrentModel && modelKey == models.get('previous'),
                next: !isCurrentModel && modelKey == models.get('next'),
            })
            // Node the relevance if any
            const relevance = modelRelevance.findKey((value, key)=>value) || null

            // If it's already loaded, current, or in the loading queue (previous or next model), set the URL
            // Setting the url of the iframe forces it to load if not yet loaded
            // TODO. We should add more intelligence to not load next/previous until current is fully loaded
            const iframeUrl = (isAlreadyLoaded || relevance) ? url : null

            // When the previous/next model anchor is closer than the current, we want to show the closer
            // model above/below the current model to create a scroll-controlled transition effect
            const divClass = `model-3d ${relevance || ''}`.trim()

            const style = relevance && tops[relevance] ? {
                top: `${Math.round(tops[relevance]*100)}%`
            } : {}

            // Return the iframe wrapped in a div. The div must have a unique key for React
            return <div key={modelKey} className={divClass} style={style}><Iframe key={modelKey}
                                                                                  src={iframeUrl}
                                                                                  name={`iframe_${modelKey}`}
                                                                                  onLoad={this.frameDidLoad.bind(this)}
            /></div>
        }, this).toArray() : [];

        // Our final product is the list of iframes. All have the same styling except that only
        // the one of the current model is visible
        return <div className="model-3ds">
            {iframes}
            <div className='model-3d-gradiant left'/>
            <div className='model-3d-gradiant right'/>
            <div className='model-3d-gradiant top'/>
            <div className='model-3d-gradiant bottom'/>
        </div>
    }

    /***
     *
     * Calculate the tops of the current, previous, and next models as a percent of how close an anchor element
     * representing them is to document scroll position. This means that
     *  1) the current model display below/above the closer of the previous/netxt model
     *  2) the previous model if any and closer than the next model displays above the current
     *  3) the next model if any and closer than the previous model displays below the current
     * Previous or next models only show on the top or bottom if they are different models than the current
     * Returns a Map of tops for the 'current', 'previous', and 'next' keys.
     * e.g. {current: .25, previous: -.75, null} or {current: 0, previous: null, next: null} or
     * {current: -.25, previous: null, next: .75}
     */
    tops() {
        const distances = this.props.closestAnchorDistances
        var tops = {}
        // If we don't have a current model, none of the tops matter
        if (distances.get('current') == null) {
            tops = {current: null, previous: null, next: null}
        }
        if (distances.filter(x=>x).count() >= 2) {
            const current = distances.get('current'),
                previous = distances.get('previous'),
                next = distances.get('next')
            const mostRelevant = (previous || Number.MAX_VALUE) < (next || Number.MAX_VALUE) ? 'previous' : 'next';
            // If previous is the closest
            if (mostRelevant == 'previous') {
                // If it's not the same model as current
                if (this.props.models.get('previous') != this.props.models.get('current')) {
                    const total = previous + current
                    tops = {
                        // The smaller the distance to previous relative to current,
                        // the more current is pushed down and less negative previous is
                        current: current / total,
                        previous: (current / total) - 1,
                        next: null
                    }
                }
            }
            // If next is the closest
            else {
                // If it's not the same model as current
                if (this.props.models.get('next') != this.props.models.get('current')) {
                    const total = next + current
                    tops = {
                        // The smaller the distance to next relative to current,
                        // the more current is pushed up and less positie previous is
                        current: 0 - (current / total),
                        previous: null,
                        next: 1 - (current / total)
                    }
                }
            }
        }
        return tops
    }
}

Model3d.propTypes = {
    settings: ImmutablePropTypes.map,
    model: ImmutablePropTypes.map,
    modelKey: PropTypes.string,
    models: ImmutablePropTypes.list,
    closestAnchorDistances: ImmutablePropTypes.map
}

function mapStateToProps(state) {
    const settings = state.get('settings')
    const documentKey = state.getIn(['documents', 'current'])
    // We use this to find out if its time to transition the current model to the next or previous
    // By transition we mean vertical move the current model up or down in the div and start showing
    // the next or previous
    const scrollPosition = state.getIn(['documents', 'entries', documentKey, 'scrollPosition'])
    // Used in conjunction with the scrollPosition to see if it's time to transition
    const closestAnchors = state.getIn(['documents', 'entries', documentKey, 'closestAnchors'])
    const models = documentKey && state.get('models')
    // Calculate the absolute distance from the current, previous, and next anchor to the scroll position
    // The previous/next distance is only valid if the model of the previous/next anchor is different than the current
    // model. If invalid we won't use it, but we still want to record it in case it's closer than the other one
    // (e.g. next might be the same model but closer than previous, which is a different model)
    const closestAnchorDistances = (closestAnchors || Map({})).map(
        (value, key) => value && models.get(key) ?
            Math.abs(scrollPosition - value.offsetTop) : null
    )

    const modelKey = models && models.get('current')
    const model = modelKey && models.getIn(['entries', modelKey])
    return {
        settings,
        models,
        modelKey,
        model,
        closestAnchorDistances
    }
}

export default connect(mapStateToProps, actions)(
    Model3d
)

