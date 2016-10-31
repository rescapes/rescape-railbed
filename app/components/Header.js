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
import rescape_png from '../images_dist/rescape-white-320.png'
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

        const headerDocuments = this.props.documents.get('entries').entrySeq().filter(([key, document]) =>
            document.get('isHeaderDocument') && document.get('showHeaderLink')
        ).map(([key, document]) =>
            <a key={key} href={`#${key}`} className="header-link">{document.get('title')}</a>
        )

        return <div className='header'>
            <img className='header-icon' src={rescape_png}/>
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