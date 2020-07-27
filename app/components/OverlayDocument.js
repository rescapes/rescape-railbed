/**
 * Created by Andy Likuski on 2016.09.22
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
import {connect} from 'react-redux';
import {Map, List} from 'immutable'
import * as actions from '../actions/document'
import * as siteActions from '../actions/site'
import {RawDocument} from './Document'
import ImmutablePropTypes from 'react-immutable-proptypes'
import close_svg from '../images/close.svg'
import DownloadButton from './DownloadButton';
import {forceDownload} from '../utils/fileHelpers'

class OverlayDocument extends Component {

    /***
     * Close the Overlay Document when the close button is clicked
     * This is here rather than in OverlayDocument so that it shows over the Header
     */
    onClickCloseButton() {
        // Clear the hash from the URL if it exists
        this.props.history.push('/');
        this.props.closeOverlayDocument()
    }

    /***
     * Downloads the underlying document
     */
    handleDownload() {
        forceDownload(document, this.props.document.get('url'), this.props.document.get('title'))
    }

    /***
     * Override to simplify. We don't need to inject headers
     * @returns {XML}
     */
    render() {
        return <div ref={(c) => this.documentDiv = c} >
            <div className='showcase-screen' />
            <ModifiedPropsDocument/>
            <div className='overlay-buttons'>
                <DownloadButton key="Download" color="black" handler={this.handleDownload.bind(this)} />
                <img className='overlay-document-close-icon' src={close_svg} onClick={this.onClickCloseButton.bind(this)} />
            </div>
        </div>
    }
}

/***
 * Override that of Document to use the currentOverlay Document instead of the current Document
 * @param state
 * @returns {{documents: *}}
 */
function mapStateToProps(state) {
    const settings = state.get('settings')
    const documentKey = state.getIn(['documents', 'currentOverlay'])
    const document = state.getIn(['documents', 'entries', documentKey])
    if (!document) {
        return {}
    }
    // We use the overlayDocumentKeys to resolve a url hash
    const overlayDocumentKeys = state.getIn(['documents', 'entries']).filter(document =>
        document.get('isHeaderDocument')
    ).keySeq().toList()
    const scrollPosition = document && document.get('scrollPosition')
    const modelKeysInDocument = document && document.get('modelKeys')
    const className = 'document overlay'
    const location = state.getIn(['documents', 'location'])
    return {
        settings,
        document: document,
        documentKey,
        models: modelKeysInDocument &&
            state.getIn(['models', 'entries']).filter((value,key) => modelKeysInDocument.includes(key)),
        overlayDocumentKeys,
        scrollPosition,
        className,
        location
    }
}

/***
 * Create a modified version of Document with different props
 */
const ModifiedPropsDocument = connect(
    mapStateToProps,
    Object.assign(actions, siteActions)
)(RawDocument)

ModifiedPropsDocument.propTypes = {
    settings: ImmutablePropTypes.map,
    document: ImmutablePropTypes.map,
    models: ImmutablePropTypes.map,
    overlayDocumentKeys: ImmutablePropTypes.list,
    scrollPosition: PropTypes.number,
    className: PropTypes.string,
    history: PropTypes.object
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the actions so that the component can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(actions, siteActions)
)(OverlayDocument)
