/**
 * Created by Andy Likuski on 2016.09.12
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { Component, PropTypes } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {normalizeModelName} from '../utils/modelHelpers'

export default class Model3dTitle extends Component {

    render() {


        // Use the specially defined title to show the model, or lacking one the model key
        // Also show the current scene
        // Apply fade aways for the title, including if the lightbox is open
        // Transitions between scene titles by applying in an element with class 'scene-title'
        // by creating a child element with the following classes
        // .scene-title-enter and .scene-title-enter-active to the entering element
        // .scene-title-leave and .scene-title-leave-active to the exiting element
        return <span className={`model-3d-title ${this.props.lightboxVisibility ? 'fade-out' : this.props.fade} ${this.props.toward}`}>
                    {this.props.model && normalizeModelName(this.props.modelKey, this.props.model)}
            <span key={this.props.sceneKey}>: {this.props.sceneKey}</span>
        </span>

    }
}

Model3dTitle.propTypes = {
    model: ImmutablePropTypes.map,
    modelKey: PropTypes.string,
    lightboxVisibility:  PropTypes.bool,
    sceneKey: PropTypes.string,
    fade: PropTypes.string,
    toward: PropTypes.string
}
