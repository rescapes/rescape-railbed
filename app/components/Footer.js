/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { Component, PropTypes } from 'react'
import * as documentActions from '../actions/document'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {connect} from 'react-redux';
import Model3dTitle from './Model3dTitle'
import {getModelTops, calculateModelFadeAndToward} from '../utils/modelHelpers'
import {Map} from 'immutable'
import * as settingsActions from '../actions/settings'

class Footer extends Component {

    render() {
        if (!this.props.models || !this.props.modelKey || !this.props.document)
            return <div/>

        const pageDownButton = !(this.props.modelKey && this.props.sceneKey) || (
            this.props.models.get('entries').keySeq().last() == this.props.modelKey &&
            this.props.models.getIn(['entries', this.props.modelKey, 'scenes', 'entries']).keySeq().last() == this.props.sceneKey) ?
            <div/> :
            <div className='page-down' onClick={ e=>this.props.scrollToNextModel() } >
                <svg className='page-down-icon' version="1.1" viewBox="153 252 125 94">
                    <defs>
                        <linearGradient id="PageDownGradient">
                            <stop offset="5%"  stopColor="white"/>
                            <stop offset="95%" stopColor="rgba(77, 78, 83, .8)"/>
                        </linearGradient>
                    </defs>
                    <g stroke="none" strokeOpacity="1" strokeDasharray="none" fill="url(#PageDownGradient)" fillOpacity="1">
                        <g>
                            <path d="M 167.24409 266.45669 L 215.43307 331.65354 L 263.62205 266.45669 Z" stroke="#6e2236" strokeLinecap="round" strokeWidth="8"/>
                            <title>Scroll to the next section</title>
                        </g>
                    </g>
                </svg>
            </div>
        const modelTops = getModelTops(this.props.document, this.props.models, this.props.settings)
        const [fade, toward] = calculateModelFadeAndToward(modelTops)
        return <div className='footer'>
            <Model3dTitle
                model={this.props.model}
                modelKey={this.props.modelKey}
                lightboxVisibility={this.props.lightboxVisibility}
                sceneKey={this.props.sceneKey}
                fade={fade}
                toward={toward}
            />
            {pageDownButton}
        </div>;
    }
}


Footer.propTypes = {
    document: ImmutablePropTypes.map,
    documentKey: PropTypes.string,
    models: ImmutablePropTypes.map,
    model: ImmutablePropTypes.map,
    modelKey: PropTypes.string,
    sceneKey: PropTypes.string,
    modelTops: PropTypes.object,
    lightboxVisibility: PropTypes.bool,
}

/***
 * Pass models, modelKey, and sceneKey so the Footer knows if were are already at the end of the
 * document and doesn't need to show the page down button
 * @param state
 * @returns {{models: *, modelKey: *, sceneKey: *}}
 */
function mapStateToProps(state) {
    const settings = state.get('settings')
    const documentKey = state.getIn(['documents', 'current'])
    const document = state.getIn(['documents', 'entries', documentKey])
    const models = documentKey && state.get('models')
    const modelKey = models && models.get('current')
    const model = modelKey ? models.getIn(['entries', modelKey]) : Map()
    const sceneKey = models && models.getIn(['entries', modelKey, 'scenes', 'current'])
    const lightboxVisibility = state.getIn(['settings', settingsActions.SET_LIGHTBOX_VISIBILITY])

    return {
        settings,
        document,
        documentKey,
        models,
        model,
        modelKey,
        sceneKey,
        lightboxVisibility,
    }
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the actions so that the component can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(documentActions)
)(Footer)