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
import YouTube from 'react-youtube'
import ReactDOM from 'react-dom'

class ModelVideo extends Component {

    onPlayerReady(event) {
        this.setState(Object.assign(this.state, {player:event.target}))
        event.target.setPlaybackQuality('highres');
        // Seek to the start
        this.playOrReset()
    }
    /***
     * Plays from the current start to end or seeks the start if no start and end are set
     */
    playOrReset() {
        // Never do anything while seeking a certain model
        if (this.props.isSeeking || !this.state.player)
            return
        // If scrolling backward go straight to the target scene
        // -1 so make sure we are still on the scene
        if  (this.props.scrollDirection == 'backward') {
            this.state.player.pauseVideo()
            this.state.player.seekTo(this.state.end, true)
        }
        // If we are scrolling upward, meaning forward-progress in the document,
        // then play the animation transition
        else {
            this.state.player.seekTo(this.state.start || .1, true)
            this.state.player.playVideo()
        }
    }

    onStateChange(event) {
        var self = this
        if (event.data == YT.PlayerState.PLAYING) {
            if (this.state.player.getCurrentTime()  >= this.state.end) {
                this.state.player.pauseVideo();
            }
            else {
                setTimeout(function() {
                    self._onStateChange(event)
                }, 200);
            }
        }
    }

    constructor(props) {
        super()
        this.state = {
            start: props.start || 0,
            end: props.end || 0,
        }
        this._onStateChange = (event)=>this.onStateChange(event)
        this._onPlayerReady = (event)=>this.onPlayerReady(event)
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.start != nextProps.start || this.state.end != nextProps.end)
            this.setState({start: nextProps.start || 0, end: nextProps.end || 0})
    }

    /***
     * Only update when the scene has changed, or if we don't have a video yet,
     * or if we just became the current model
     * @param nextProps and thus play the video if start or end changed
     * @param nextState
     * @returns {boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return !this.state.player ||
            this.state.start != nextState.start ||
            this.state.end != nextState.end ||
            nextProps.isCurrentModel && !this.props.isCurrentModel
    }

    componentDidMount() {
        if (this.state.player)
            this.playOrReset()
    }

    componentDidUpdate() {
        if (this.state.player)
            this.playOrReset()
    }

    render() {
        const opts = {
            playerVars:{
                controls: 0,
                disablekb: 0,
                fs: 0,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
                showinfo: 0,
            }
        };

        if (!this.props.videoId) {
            return <div className="model-video"/>
        }
        return <div key={this.props.videoId} className="model-video">
            <YouTube
                videoId={this.props.videoId}
                className='model-video-youtube'
                suggestedQuality='highres'
                opts={opts}
                onReady={this._onPlayerReady}
                onStateChange={this._onStateChange}
            />
        </div>
    }
}

ModelVideo.propTypes = {
    videoId: PropTypes.string,
    start: PropTypes.number,
    end: PropTypes.number,
    toward: PropTypes.string,
    scrollDirection: PropTypes.string,
    // If true this meens we are seeking through the videos so don't play anything
    isSeeking: PropTypes.bool,
    isCurrentModel: PropTypes.bool
}

export default ModelVideo
