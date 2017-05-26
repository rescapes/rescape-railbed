/**
 * Created by Andy Likuski on 2016.09.19
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

/***
 * Shows a node of the table of contents, including the circle and label
 * We only show the normalized models as nodes, so two models such
 * as Comfort of Seating (Tram) vand Comfort of Seating (AMTRAK) will share a node
 */
export default class DocumentGraphNode extends React.Component {

    render() {
        const node = this.props.node
        let style = null
        // The normalized model name
        const normalizedCurrentModelName = normalizeModelName(this.props.modelKey, this.props.model)
        const normalizedModelName = normalizeModelName(node.key, this.props.model)
        if (this.props.isTop && node.key==this.props.documentTitle) {
            // The document.
            return <div className={`table-of-contents-node toc-document ${this.props.isExpanded ? 'expanded' : ''}`}
                        onClick={()=>this.props.scrollToTop()} key={node.key} >
                <div className='outline'>
                    {node.key}
                </div>
            </div>
        }
        else if (this.props.isTop && node.key == normalizedCurrentModelName) {
            // The current model
            return <div className='table-of-contents-node toc-model-current' key={node.key} >
                <div className='outline'>
                    {node.key}
                </div>
            </div>
        }
        else if (['start', 'end'].includes(node.key)) {
            // A fake node representing the start/end of the line
            return <div className='table-of-contents-node toc-end' key={node.key} >
            </div>
        }
        else {
            // All other model nodes
            return <div className="table-of-contents-node toc-model" key={node.key}
                        onClick={()=>this.props.scrollToModel(node.key)}
            >
                <div className='outline'>
                    {node.key}
                </div>
            </div>
        }
    }
}

DocumentGraphNode.propKeys = {
    documents: ImmutablePropTypes.map,
    documentTitle: PropTypes.string,
    documentKey: PropTypes.string,
    modelKey: PropTypes.string,
    models: ImmutablePropTypes.map,
    model: ImmutablePropTypes.map,
    tableOfContentsAreShowing: PropTypes.bool,
    position: PropTypes.string,
    node: PropTypes.object,
    // The node index
    index: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    isExpanded: PropTypes.bool,
    isExpandedByHover: PropTypes.bool,
    documentCommentsAreShowing: PropTypes.bool,
    modelCommentsAreShowing: PropTypes.bool
}
