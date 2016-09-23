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
import {RawDocument} from './Document'
import ImmutablePropTypes from 'react-immutable-proptypes'

class OverlayDocument extends Component {



    /***
     * Override to simplify. We don't need to inject headers
     * @returns {XML}
     */
    render() {
        return <ModifiedPropsDocument/>
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

    const scrollPosition = document && document.get('scrollPosition')
    const modelKeysInDocument = document && document.get('modelKeys')
    const className = 'document overlay'
    return {
        settings,
        document: document,
        documentKey,
        models: modelKeysInDocument &&
        state.getIn(['models', 'entries']).filter((value,key) => modelKeysInDocument.includes(key)),
        scrollPosition,
        className,
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
    scrollPosition: PropTypes.number,
    className: PropTypes.string,
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the actions so that the component can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(actions, siteActions)
)(OverlayDocument)
