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
import rescape_png from '../images_dist/rescape-320.png'
import * as documentActions from '../actions/document'
import {connect} from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes'

class Header extends Component {


    /***
     * Overlay the header document when the link is clicked
     * @param documentKey
     */
    onClickHeaderLink(documentKey) {
        this.props.overlayDocument(documentKey)
    }

    render() {
        if (!this.props.models || !this.props.modelKey || !this.props.document)
            return <div/>

        /*
        // Show the page up button if we're notm at the top already
        const pageUpButton = !(this.props.modelKey && this.props.sceneKey) || (
            this.props.models.get('entries').keySeq().first() == this.props.modelKey &&
            this.props.models.getIn(['entries', this.props.modelKey, 'scenes', 'entries']).keySeq().first() == this.props.sceneKey) ?
            <div/> :
            <div className='page-up' onClick={ e=>this.props.scrollToPreviousModel() } >
                <svg className='page-up-icon' version="1.1" viewBox="153 252 125 94" >
                    <defs>
                        <linearGradient id="PageUpGradient">
                            <stop offset="5%"  stopColor="white"/>
                            <stop offset="95%" stopColor="rgba(77, 78, 83, .8)"/>
                        </linearGradient>
                    </defs>
                    <g stroke="none" strokeOpacity="1" strokeDasharray="none" fill="url(#PageUpGradient)" fillOpacity="1">
                        <g>
                            <path d="M 263.62205 331.65354 L 215.43307 266.45669 L 167.24409 331.65354 Z" stroke="#6e2236" strokeLinecap="round" strokeWidth="8"/>
                            <title>Scroll to the previous section</title>
                        </g>
                    </g>
                </svg>
            </div>
        */

        const headerDocuments = this.props.documents.get('entries').entrySeq().filter(([key, document]) =>
            document.get('isHeaderDocument') && document.get('showHeaderLink')
        ).map(([key, document]) =>
            <span key={key} className="header-link" onClick={e => this.onClickHeaderLink(key)}>{document.get('title')}</span>
        )

        return <div className='header'>
            <img className='header-icon' src={rescape_png}/>
            <div className='header-gradient left' />
            <div className='header-links'>
                {headerDocuments}
            </div>
        </div>
    }
}

Header.propTypes = {
    documents: ImmutablePropTypes.map,
    document: ImmutablePropTypes.map,
    documentTitle: PropTypes.string,
    models: ImmutablePropTypes.map,
    modelKey: PropTypes.string,
    sceneKey: PropTypes.string
}

/***
 * Pass models, modelKey, and sceneKey so the Header knows if were are already at the start of the
 * document and doesn't need to show the page up button
 * @param state
 * @returns {{models: *, modelKey: *, sceneKey: *}}
 */
function mapStateToProps(state) {
    const documents = state.get('documents')
    const documentKey = state.getIn(['documents', 'current'])
    const document = state.getIn(['documents', 'entries', documentKey])
    const models = documentKey && state.get('models')
    const modelKey = models && models.get('current')
    const sceneKey = models && models.getIn(['entries', modelKey, 'scenes', 'current'])

    return {
        documents,
        documentKey,
        document,
        models,
        modelKey,
        sceneKey
    }
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the actions so that the component can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(documentActions)
)(Header)