/**
 * Created by Andy Likuski on 2016.09.08
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { Component, PropTypes } from 'react'
import {default as Video, Controls, Overlay} from 'react-html5video'
import ReactDOM from 'react-dom'

class ModelVideo extends Component {

    reloadVideo() {
        // When changing a HTML5 video, you have to reload it.
        this.refs.video.load();
        this.refs.video.play();
    }

    togglePlay() {
        this.refs.video.togglePlay();
    }

    toggleMute() {
        this.refs.video.toggleMute()
    }

    load() {
        this.refs.video.load();
    }

    /***
     * Plays from the current start to end or seeks the start if no start and end are set
     */
    playOrReset() {
        if (this.state.start == 0 && this.state.end == 0) {
            // Seeking the start amazingly doesn't work. We have to reload
            this.refs.video.load()
        }
        else {
            // If scrolling backward go straight to the target scene
            if  (this.props.scrollDirection == 'backward') {
                this.seek(this.state.end, true)
            }
            // If we are scrolling upward, meaning forward-progress in the document,
            // then play the animation transition
            else {
                this.seek(this.state.start, true)
                // If end > 0 play to that point
                if (this.state.end)
                    this.refs.video.play();
            }
        }

    }

    seek(time, force) {
        this.refs.video.seek(time, force);
    }

    onProgress() {
        console.log(this.state.start, this.refs.video.videoEl.currentTime, this.state.end)
        if (this.refs.video.videoEl.currentTime  >= this.state.end) {
            this.pause();
        }
    }

    pause() {
        this.refs.video.pause();
    }

    constructor(props) {
        super()
        this.state = {start: props.start || 0, end: props.end || 0}
        this._onProgress = (event)=>this.onProgress(event)
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.start != nextProps.start || this.state.end != nextProps.end)
            this.setState({start: nextProps.start || 0, end: nextProps.end || 0})
    }

    /***
     * Only update when the scene has changed, or if we don't have a video yet
     * @param nextProps and thus play the video if start or end changed
     * @param nextState
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return !this.refs.video || this.state.start != nextState.start || this.state.end != nextState.end
    }

    componentDidMount() {
        if (this.refs.video)
            this.playOrReset()
    }

    componentDidUpdate() {
        if (this.refs.video)
            this.playOrReset()
    }

    render() {
        if (!this.props.videoUrl) {
            return <div className="model-video"/>
        }

        return <div className="model-video">
            <Video
                className="video"
                muted
                onTimeUpdate={this._onProgress}
                ref="video">
                <source src={this.props.videoUrl} type="video/webm" />
                <Overlay />
                <Controls />
            </Video>
        </div>
    }
}

ModelVideo.propTypes = {
    videoUrl: PropTypes.string,
    start: PropTypes.number,
    end: PropTypes.number,
    toward: PropTypes.string,
    scrollDirection: PropTypes.string
}

export default ModelVideo
