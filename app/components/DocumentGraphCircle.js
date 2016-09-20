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
import model_circle_svg from '../images/model-circle.svg'
import model_circle_current_svg from '../images/model-circle-current.svg'


export default class DocumentGraphCircle extends React.Component {

    render() {
        const node = this.props.node
        let style = null
        let file = null, className = null
        if (this.props.isTop && this.props.isLast) {
            // The document
            return <div className='table-of-contents-node document' key={node.key} style={{left: `${node.x}%`, top: `${node.y}%`}}>
                <img className='circle' style={style} src={document_circle_svg} />
                <div className='outline'>
                    {node.key}
                </div>
            </div>
        }
        else if (this.props.isTop && this.props.index == 0) {
            // The current model
            return <div className='table-of-contents-node model-current' key={node.key} style={{left: `${node.x}%`, top: `${node.y}%`}}>
                <img className='circle' src={model_circle_current_svg} />
                <div className='outline'>
                    {node.key}
                </div>
            </div>
        }
        else {
            // All other model nodes
            return <div className="table-of-contents-node model" key={node.key} style={{left: `${node.x}%`, top: `${node.y}%`}}>
                <img className='circle' src={model_circle_svg} />
                <div className='outline'>
                    {node.key}
                </div>
            </div>
        }
    }
}

DocumentGraphCircle.propKeys = {
    documents: ImmutablePropTypes.map,
    documentTitle: PropTypes.string,
    documentKey: PropTypes.string,
    modelKey: PropTypes.string,
    models: ImmutablePropTypes.map,
    model: ImmutablePropTypes.map,
    tableOfContentsAreShowing: PropTypes.bool,
    position: PropTypes.string,
    node: PropTypes.object,
    // Is this the last node
    isLast: PropTypes.bool,
    // The node index
    index: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
}
