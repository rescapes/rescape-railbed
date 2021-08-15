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

import React, {Component, PropTypes} from 'react';
import ReactPlayer from 'react-player';

class ModelVideo extends Component {

  onPlayerReady(event) {
    this.setState({player: this.reactPlayer});
    // Seek to the start
    this.playOrReset();
  }

  /***
   * Plays from the current start to end or seeks the start if no start and end are set
   */
  playOrReset() {
    if (!this.props.isCurrentModel) {
      return;
    }
    //console.log(this.state.playingStatus)
    // Never do anything while seeking a certain model or an overlay is showing
    if (this.props.isDisabled || !this.state.player)
      return;
    // If scrolling backward go straight to the target scene
    // -1 so make sure we are still on the scene
    if (this.props.scrollDirection === 'backward') {
      this.state.player.player.player.pause();
      this.state.player.player.player.currentTime = this.props.end;
      //console.log('Backwards SEEK and STOP');
      this.setState({playingStatus: null});
    }
      // If we are scrolling upward, meaning forward-progress in the document,
    // then play the animation transition
    else {
      const current = this.props.start || .1;
      if (!this.state.playingStatus && this.state.player.getCurrentTime() < this.props.end) {
        this.state.player.player.player.currentTime = current;
        if (!this.state.playingStatus) {
          this.setState({playingStatus: 'beginning'});
          this.state.player.player.player.muted = true
          this.state.player.player.player.play().then(() => {
            this.setState({playingStatus: 'started'});
            //console.log('Start PLAYING');
          })
        }
      }
    }
  }

  onStateChange(event) {
      if (this.props.isCurrentModel) {
        if (this._changing) {
          return
        }
        this._changing = true
        try {
          if (this.state.playingStatus === 'started' && this.state.player.getCurrentTime() >= this.props.end) {
            //console.log(`Exceeded scene end ${this.props.end}, ENDING`)
            this.state.player.player.player.pause();
            // Set null so we can start again next time the scene changes
            this.setState({playingStatus: null});
          } else {
            // Keep playing
            //console.log(`Keep PLAYING ${event.playedSeconds}`);
          }
        }
        finally {
          this._changing = false
        }
      } else if (this.state.playingStatus === 'started') {
        this.state.player.player.player.pause();
        this.setState({playingStatus: null});
      }
    }

  constructor(props) {
    super(props);
    this._onStateChange = (event) => this.onStateChange(event);
    this._onPlayerReady = (event) => this.onPlayerReady(event);
  }

  /***
   * Only update when the scene has changed, or if we don't have a video yet,
   * or if we just became the current model
   * @param nextProps and thus play the video if start or end changed
   * @param nextState
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    // Don't mess with the video during active scrolling
    if (this.props.documentIsScrolling)
      return false;

    return !this.state || !this.state.player ||
      this.props.sceneKey !== nextProps.sceneKey ||
      nextProps.isCurrentModel && !this.props.isCurrentModel ||
      nextProps.className !== this.props.className;
  }

  componentDidUpdate() {
    if (this.state && this.state.player)
      this.playOrReset();
  }

  /***
   * Renders the video if the this.props.videoUrl has been set, meaning the video should be loaded
   * @returns {XML}
   */
  render() {
    if (!this.props.videoUrl)
      return <div className={this.props.className}/>;

    const opts = {
      playerVars: {
        controls: 0,
        disablekb: 0,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        showinfo: 0
      }
    };

    return <div key={this.props.videoId} className={this.props.className}>
      <ReactPlayer
        ref={(c) => this.reactPlayer = c}
        url={this.props.videoUrl}
        playing={false}
        loop={false}
        controls={false}
        light={false}
        volume={0}
        muted={true}
        pip={false}
        className='model-video-youtube'
        width={'100%'}
        height={'100%'}
        onReady={this._onPlayerReady}
        progressInterval={50}
        onProgress={this._onStateChange}
      />
    </div>;
  }
}

ModelVideo.propTypes = {
  videoId: PropTypes.string,
  sceneKey: PropTypes.string,
  start: PropTypes.number,
  end: PropTypes.number,
  toward: PropTypes.string,
  scrollDirection: PropTypes.string,
  // If true this means we are seeking through the videos or a document overlay is present, so don't play anything
  isDisabled: PropTypes.bool,
  isCurrentModel: PropTypes.bool,
  className: PropTypes.string,
  documentIsScrolling: PropTypes.bool
};

export default ModelVideo;
