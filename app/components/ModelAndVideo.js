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
import Iframe from './Iframe'
import {Map} from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ModelVideo from './ModelVideo'
import {currentSceneKeyOfModel, checkIf3dSet} from '../utils/modelHelpers'
import config from '../config'
import Statuses from '../statuses'

export default class ModelAndVideo extends Component {

    /***
     * Renders the model in an iframe. By setting the url we commence model loading here
     * @returns {XML}
     */
    render() {
        const modelTops = this.props.modelTops
        const models = this.props.models
        const modelKey = this.props.modelKey
        const loadingOrReady = Statuses.LOADING | Statuses.READY
        const status = this.props.model.get('status')
        const isAlreadyLoaded = !!(status & loadingOrReady)
        const isCurrentModel = this.props.currentModel == this.props.model
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
            top: `${Math.round(modelTops[relevance] * 100)}%`,
            bottom: `${-1 * Math.round(modelTops[relevance] * 100)}%`,
        } : {}


        // Determine whether to show the 3d model or video
        let model3dSketchup = <span/>
        const is3dSet = checkIf3dSet(this.props.model, this.props.defaultIs3dSet)
        if (is3dSet) {
            // If it's already loaded, current, or in the loading queue (previous or next model), set the URL
            // Setting the url of the iframe forces it to load if not yet loaded
            // TODO. We should add more intelligence to not load next/previous until current is fully loaded
            const url = this.props.get('url')
            const iframeUrl = (isAlreadyLoaded || relevance) ? url : null

            model3dSketchup = [
                <span className='model-3d-help'>
                    <p>Scroll to zoom (z)</p>
                    <p>Drag to orbit (o)</p>
                    <p>Shift-Drag to pan (h)</p>
                    <p>Right-side button for scenes</p>
                </span>,
                <Iframe className="model-3d-iframe" key={modelKey}
                        src={iframeUrl}
                        name={`iframe_${modelKey}`}
                        onLoad={this.frameDidLoad.bind(this)}
                />]
        }

        // The videoUrl is that of the model if already loaded, current, or in the loading queue
        const videoUrl = this.props.model.get('videoUrl')
        // The Youtube video id
        const videoId = this.props.model.get('videoId')
        const sceneKey = currentSceneKeyOfModel(this.props.model)
        // Get the time to play the video to transition from one scene to the next
        const sceneTransitionTime = this.props.model.get('sceneTransitionTime') || config.SCENE_TRANSITION_TIME
        const sceneIndex = (this.props.model.getIn(['scenes', 'entries']) || Map()).keySeq().indexOf(sceneKey)
        // We need to transition from the last scene (or position) to the current scene
        const start = (sceneIndex - 1 >= 0 ? sceneIndex - 1 : 0) * sceneTransitionTime,
            end = (sceneIndex >= 0 ? sceneIndex : 0) * sceneTransitionTime

        const model3dVideo = <ModelVideo
            className={`model-video${is3dSet ? ' sketchup-active' : ''}`}
            key={modelKey}
            videoUrl={videoUrl}
            videoId={videoId}
            start={start}
            end={end}
            scrollDirection={this.props.scrollDirection}
            isSeeking={this.props.isSeeking}
            isCurrentModel={isCurrentModel}
        />


        // Return the iframe or video wrapped in a div. The div must have a unique key for React
        return <div key={this.props.modelKey} className={`${divClass} ${divStateClass}`} style={style}>
            { model3dVideo }
            { model3dSketchup }
        </div>
    }
}

ModelAndVideo.propTypes = {
    model: ImmutablePropTypes.map,
    models: ImmutablePropTypes.map,
    modelKey: PropTypes.string,
    modelTops: PropTypes.object,
    currentModel: ImmutablePropTypes.map,
    scrollDirection: PropTypes.string
}

