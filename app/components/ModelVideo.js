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

    /***
     * The URL with start/end timecodes
     * If no time codes are present we set the start and end time to 0 so nothing plays,
     * since it probably means we are at the initial scene
     * @returns {string}
     */
    url() {
        return `${this.props.videoUrl}#t=${this.props.start || 0},${this.props.end || 0}`
    }

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

    play() {
        this.seek(this.props.start)
        this.refs.video.play();
    }

    seek(time) {
        this.refs.video.seek(time);
    }

    onProgress() {
        const el = ReactDOM.findDOMNode(this.refs.video).getElementsByTagName('video')[0];
        const end = this.props.end
        if (el.buffered.length && el.currentTime >= end)
            this.pause()
    }

    pause() {
        this.refs.video.pause();
    }

    render() {
        return <div className="model-video">
            <Video
                className="video"
                muted
                autoPlay
                onProgress={this.onProgress.bind(this)}
                ref="video">
                <source src={this.url()} type="video/mp4" />
                <Overlay />
                <Controls />
            </Video>
        </div>
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps['start'] != this.props['start']  ||
            nextProps['end'] != this.props['end']) {

            if (nextProps['start'] != nextProps['end']) {
                this.play(nextProps['start'], nextProps['end'])
            }
        }
    }
}

ModelVideo.propTypes = {
    videoUrl: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
}
export default ModelVideo
