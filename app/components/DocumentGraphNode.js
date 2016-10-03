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
import {connect} from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes'
import document_circle_svg from '../images/document-circle.svg'
import document_circle_locked_svg from '../images/document-circle-locked.svg'
import document_circle_unlocked_svg from '../images/document-circle-unlocked.svg'
import model_circle_svg from '../images/model-circle.svg'
import model_circle_current_svg from '../images/model-circle-current.svg'
import {normalizeModelName} from '../utils/modelHelpers'
import CommentsButton from './CommentsButton'

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
        const normalizedModelName = normalizeModelName(this.props.modelKey, this.props.model)
        if (this.props.isTop && node.key==this.props.documentTitle) {
            // The document. We can toggle the table of contents here with mouseEnter
            // The mouseLeave is on the overall toc DOM element so that it stays open after hover
            // Alternatively the user can lock the toc open by clicking, and then close by clicking again
            const svg = this.props.isExpanded ? (
                this.props.isExpandedByHover ?
                    document_circle_unlocked_svg:
                    document_circle_locked_svg
                ) :
                document_circle_svg
            // Shows the comments button for the overall document
            const documentCommentsButton = this.props.documentKey ?
                <CommentsButton className='document-comments-counter'
                                key="'document-comments-counter"
                                document={this.props.document}
                                documentKey={this.props.documentKey}
                                documentTitle={this.props.documentTitle}
                                commentsAreShowing={this.props.documentCommentsAreShowing}
                /> : <span/>


            return <div className={`table-of-contents-node toc-document ${this.props.isExpanded ? 'expanded' : ''}`}
                        key={node.key}
                        style={{left: `${node.x}%`, top: `${node.y}%`}}>
                {documentCommentsButton}
                <img className='circle'
                     style={style} src={svg}
                     onMouseEnter={()=>this.props.toggleTableOfContents(this.props.documentKey, true, true)}
                     onClick={()=>this.props.toggleTableOfContents(this.props.documentKey)}
                />
                <div className="connector" />
                <div ref="outline" className='outline'>
                    {node.key}
                </div>
            </div>
        }
        else if (this.props.isTop && this.props.node.key == normalizedModelName) {

            // Shows the comments button for the current model
            const modelCommentsButton = this.props.modelKey ?
                <CommentsButton className='model-comments-counter'
                                key="model-comments-counter"
                                document={this.props.document}
                                documentKey={this.props.documentKey}
                                documentTitle={this.props.documentTitle}
                                model={this.props.model}
                                modelKey={this.props.modelKey}
                                commentsAreShowing={this.props.modelCommentsAreShowing}
                /> : <span/>

            // The current model
            return <div className='table-of-contents-node toc-model-current' key={node.key} style={{left: `${node.x}%`, top: `${node.y}%`}}>
                {modelCommentsButton}
                <img className='circle' src={model_circle_current_svg} />
                <div className="connector" />
                <div className='outline'>
                    {node.key}
                </div>
            </div>
        }
        else if (['start', 'end'].includes(this.props.node.key)) {
            // A fake node representing the start/end of the line
            return <div className='table-of-contents-node toc-end' key={node.key} style={{left: `${node.x}%`, top: `${node.y}%`}}>
            </div>
        }
        else {
            // All other model nodes
            return <div className="table-of-contents-node toc-model" key={node.key} style={{left: `${node.x}%`, top: `${node.y}%`}}
                        onClick={()=>this.props.scrollToModel(node.key)}
            >
                <img className='circle' src={model_circle_svg} />
                <div className="connector" />
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
