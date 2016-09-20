/**
 * Created by Andy Likuski on 2016.09.14
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes'
import close_svg from '../images/close.svg'
import table_of_contents_svg_top from '../images/table_of_contents_top.svg'
import test_svg from '../images/test.svg'
import table_of_contents_svg_bottom from '../images/table_of_contents_bottom.svg'
import * as documentActions from '../actions/document'
import DocumentGraph from './DocumentGraph'

class TableOfContents extends Component {

    componentDidMount() {
    }

    /***
     * Show the comments when the user clicks the comment count button
     */
    onClickTableOfContentsButton() {
        this.props.toggleTableOfContents(this.props.modelKey, true)
    }

    /***
     * Hide the comments when the user clicks the close button
     */
    onClickCloseButton() {
        this.props.toggleTableOfContents(this.props.modelKey, false)
    }

    /***
     * Render the comment counter button for the current model or render the comments if the button is
     * clicked
     * @returns {XML}
     */
    render() {
        if (!this.props.documentTitle || !this.props.modelKey) {
            return <div/>
        }

        //<img className='table-of-contents-icon' src={this.props.isTop ? test_svg : table_of_contents_svg_bottom} onClick={this.onClickTableOfContentsButton.bind(this)} />
        return <div className={`table-of-contents ${this.props.isTop ? 'top': 'bottom'} ${this.props.isExpanded ? 'expanded' : ''}`}>
            <DocumentGraph
                   isExpanded={this.props.isExpanded}
                   isTop={this.props.isTop}
                   x={100}
                   y={100* 90/300}
                   widthExpanded={100}
                   width={100}
                   height={100 * 90/300}
                   circleRadius={2}
                   lineRadius={2}
           />
        </div>
    }
}

TableOfContents.propKeys = {
    documents: ImmutablePropTypes.map,
    documentTitle: PropTypes.string,
    documentKey: PropTypes.string,
    modelKey: PropTypes.string,
    models: ImmutablePropTypes.map,
    model: ImmutablePropTypes.map,
    isExpanded: PropTypes.bool,
    isTop: PropTypes.bool
}

function mapStateToProps(state, props) {
    const settings = state.get('settings')
    const documents = state.get('documents')
    const documentKey = documents.get('current')
    const models = documentKey ? state.get('models') : Map()
    const modelKey = models && models.get('current')
    const document = state.getIn(['documents', 'entries', documentKey])
    const documentTitle = document && document.get('title')

    return {
        settings,
        documents,
        document,
        documentKey,
        models,
        modelKey,
        documentTitle,
    }
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the site actions so that the child components can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(documentActions)
)(TableOfContents)
