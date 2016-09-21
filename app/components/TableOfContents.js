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
import DocumentGraph from './DocumentGraph'
import * as documentActions from '../actions/document'

class TableOfContents extends Component {

    componentDidMount() {
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
        // Width and height here must match the table-of-contents width and height
        return <div className={`table-of-contents ${this.props.isTop ? 'top': 'bottom'} ${this.props.isExpanded ? 'expanded' : ''}`}>
            <DocumentGraph
                   isTop={this.props.isTop}
                   widthExpanded={800}
                   width={200}
                   height={60}
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
    const isExpanded = document.get('tableOfContentsIsExpanded')

    return {
        settings,
        documents,
        document,
        documentKey,
        models,
        modelKey,
        documentTitle,
        isExpanded
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
