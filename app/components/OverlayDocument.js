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
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import {connect} from 'react-redux';
import {Map, List} from 'immutable'
import * as actions from '../actions/document'
import * as siteActions from '../actions/site'
import Document from './Document'

class OverlayDocument extends Document {

    /***
     * Override
     * @returns {string}
     */
    className() {
        return 'overlay-document'
    }

    /***
     * Override to simplify. We don't need to inject headers
     * @returns {XML}
     */
    render() {
        const document = this.props.document
        if (!document)
            return <div/>
        const body = document.getIn(['content', 'body'])
        if (!body)
            return <div/>
        // The only processing we do to the Google doc HTML is the following:
        // 1) Replace pairs of <hr> elements with <div className='modelSection'>...</div>
        // This allows us to style each portion of the doc to match a corresponding 3D model
        const modifiedBody = this.injectStyledDivWrappers(body)

        return <div className='overlay-document'>
            <div dangerouslySetInnerHTML={{__html: modifiedBody }}>
            </div>
            <div className='document-gradient right' />
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
    const currentDocumentKey = state.getIn(['documents', 'currentOverlay'])
    const document = state.getIn(['documents', 'entries', currentDocumentKey])
    if (!document) {
        return {}
    }

    const scrollPosition = document && document.get('scrollPosition')
    const modelKeysInDocument = document && document.get('modelKeys')
    return {
        settings,
        document: document,
        models: modelKeysInDocument &&
        state.getIn(['models', 'entries']).filter((value,key) => modelKeysInDocument.includes(key)),
        scrollPosition
    }
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the actions so that the component can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(actions, siteActions)
)(OverlayDocument)
