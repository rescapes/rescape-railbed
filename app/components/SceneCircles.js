/**
 * Created by Andy Likuski on 2016.10.26
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import PropTypes from 'prop-types';
import React, { Component} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {Map} from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'

/***
 * Absolute positioned scene markers that go alongside the document
 * The current model/scene is marked active. We also mark the first scene of a model that has no subheading
 * in the document with no-subheading
 */
export default class SceneCircles extends Component {

    render() {
        // Wait for the model to be active
        if (!this.props.modelKey)
            return <div className="scene-circles"/>

        const sceneCircles = (this.props.sceneAnchors || []).map(function(sceneAnchor) {
            const [modelKey, sceneKey] = sceneAnchor.name.split('_')
            const active = sceneAnchor.name == [this.props.modelKey, this.props.sceneKey].join('_') ? ' active' : ''
            const noSubheading = this.props.models.get(modelKey).get('noSubheading') &&
                    this.props.models.get(modelKey).getIn(['scenes', 'entries']).keySeq().indexOf(sceneKey)==0 ?
                ' no-subheading': ''
            return <div key={sceneAnchor.name}
                className={`toc-scene${active}${noSubheading}`}
                style={{top:`${sceneAnchor.offsetTop}px`}} />
        }, this)
        return <div className="scene-circles">
                {sceneCircles}
        </div>
    }
}

SceneCircles.propTypes = {
    models: ImmutablePropTypes.map,
    modelKey: PropTypes.string,
    sceneKey: PropTypes.string,
    sceneAnchors: PropTypes.array
}