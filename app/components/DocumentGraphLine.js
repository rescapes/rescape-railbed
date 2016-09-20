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
import {OrderedMap, Map, List} from 'immutable'

/***
 * Displays the line for the models of the Document.
 * We show either the condensed view or the expanded view.
 *
 * The condensed view on top makes a short line that shows the current model and space for two previous models and
 * ellipses if needed. It connects to the document node on top, so that is considered in the line's length.
 *
 * The expanded view on top makes a long line that shows the current model and all previous models. It connects
 * to the Document node on top, so that is considered in the line's length
 *
 * The condensed view on the bottom makes a short line that shows the next two models and ellipses if needed.
 *
 * The expanded view on the bottom makes a long line that shows all subsequent models.
 */
class DocumentGraphLine extends React.Component {


    /***
     * Converts a list of nodes to line segments connecting theem
     * @param nodes
     * @returns {*}
     */
    getLineSegments(nodes) {
        // Start at the 2nd node. The initial state of the reduction covers the 1st node, which is always at position x,y
        return nodes.slice(1).reduce((reduction, node, i) => {
            // Get the last point of the last segment, or if at the start use x and y
            const previous = reduction.count() ? reduction.slice(-1).get(0) : {x2:`${nodes[0].x}%`, y2:`${nodes[0].y}%`}
            // Dash the line if the line segment represents nodes that we aren't showing
            const strokeDashArray = !this.props.isExpanded && nodes.length < this.props.totalNodeCount && i==nodes.length-2 ? "5,10,1,10" : "none"
            return reduction.push({
                x1:`${previous.x2}`,
                 y1:`${previous.y2}`,
                 x2:`${node.x}%`,
                 y2:`${node.y}%`,
                 strokeDasharray: strokeDashArray
            })
        }, List()).toArray()
    }

    render() {
        const nodes = this.props.nodes
        const lineSegments = this.getLineSegments(nodes).map((lineSegment, index) =>
            <line key={nodes[index].key} {...lineSegment} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth={`${this.props.lineRadius}%`} />
        )
        // Get the number of models not showing because they don't fit
        const hiddenModelsCount = this.props.totalNodeCount - nodes.length;
        const hiddenModelDom = hiddenModelsCount ?
            <div className="hiddenModelCount">{hiddenModelsCount} More</div>: <div/>

        return <div className="document-graph">
            <svg className='document-graph-svg'
                 ref='svg'
                 viewBox={`0 0 ${this.props.viewboxWidth} ${this.props.height}`}
                 preserveAspectRatio="xMinYMin meet"
            >
                <g stroke="none" strokeOpacity="1" strokeDasharray="none" fill="solid" fillOpacity="1">
                    {lineSegments}
                </g>
            </svg>
            {hiddenModelDom}
        </div>
    }
}

DocumentGraphLine.propKeys = {
    documents: ImmutablePropTypes.map,
    documentTitle: PropTypes.string,
    documentKey: PropTypes.string,
    modelKey: PropTypes.string,
    models: ImmutablePropTypes.map,
    model: ImmutablePropTypes.map,
    tableOfContentsAreShowing: PropTypes.bool,
    // The normalized height of the overall DocumentGraph
    height: PropTypes.number,
    // The normalized width of the DocumentGraph
    width: PropTypes.number,
    // The width to give the viewbox so the normalized width works. The height is the same either way
    viewboxWidth: PropTypes.number,
    // Whether or not the graph is expanded
    isExpanded: PropTypes.bool,
    // Is this the top graph (true) or bottom graph (false)
    isTop: PropTypes.bool,
    // The radius of the node circles
    circleRadius: PropTypes.number,
    // The line radius
    lineRadius: PropTypes.number,
    // The nodes
    nodes: PropTypes.array,
    // This tells the nonexpanded line whether or not the last segment represents non-showing nodes
    totalNodeCount: PropTypes.number,
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
        documentTitle
    }
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 */
export default connect(
    mapStateToProps,
)(DocumentGraphLine)