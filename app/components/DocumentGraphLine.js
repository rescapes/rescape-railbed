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
    * All of the models before and including the current or all of the models after the current
    * If this is the top graph reverse the items so we go from the current toward the beginning
    **/
    getObjects() {
        const allModels = this.props.models.get('entries')
        const modelsForPosition = this.props.isTop ?
            allModels.slice(0, allModels.keySeq().indexOf(this.props.modelKey) + 1).reverse() :
            allModels.slice(allModels.keySeq().indexOf(this.props.modelKey) + 1)
        // Reduce the models to 3 unless we are expanded
        const models = this.props.isExpanded ? modelsForPosition : modelsForPosition.slice(0,3)
        // Nodes are the document (top only) plus the models.
        return new OrderedMap(
            this.props.isTop ? {[this.props.documentTitle]: this.props.document} : {}
        ).concat(models)
    }

    /***
     * Map the objects to nodes with x and y positions
     * @param objects
     * @returns {*}
     */
    getNodes(objects) {
        const yFactor = this.props.height / this.props.width
        const x = this.props.x - this.props.circleRadius*2
        const y = this.props.y - yFactor*this.props.circleRadius*2
        // Move to the starting position
        // The width of the graph is longer when expanded
        // Reduce the width and height somewhat so the nodes at the end fit with the viewBox
        const width = (this.props.isExpanded ? this.props.widthExpanded : this.props.width) - this.props.circleRadius*4
        const height = this.props.height - yFactor*this.props.circleRadius*2
        const length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))

        // The segment length for the line
        const segmentLength = length / (objects.count()-1)

        // The top graph goes up (-y) the bottom graph goes down (+y). They both go left
        const yDirection = this.props.isTop ? -1 : 1
        const theta = Math.atan(height / width);
        return objects.entrySeq().map(([key, obj], i) => {
            const xi = x - (i * segmentLength) * Math.cos(theta)
            const yi = y + yDirection * (i * segmentLength) * Math.sin(theta)
            return { x:xi, y:yi, key: key, obj: obj}
        }, List()).toArray()
    }

    /***
     * Converts a list of nodes to line segments connecting theem
     * @param nodes
     * @returns {*}
     */
    getLineSegments(nodes) {
        // Start at the 2nd node. The initial state of the reduction covers the 1st node, which is always at position x,y
        return nodes.slice(1).reduce((reduction, node, i) => {
            // Get the last point of the last segment, or if at the start use x and y
            const previous = reduction.count() ? reduction.slice(-1).get(0) : {x2:nodes[0].x, y2:nodes[0].y}
            return reduction.push(
                {x1:previous.x2,
                 y1:previous.y2,
                 x2:node.x,
                 y2:node.y,
                 strokeDasharray:"5,10,1,10"
            })
        }, List()).toArray()
    }

    render() {
        const objs = this.getObjects()
        const nodes = this.getNodes(objs)
        const lineSegments = this.getLineSegments(nodes).map((lineSegment, index) =>
            <line key={nodes[index].key} {...lineSegment} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth={`${this.props.lineRadius}%`} />
        )
        const nodeCircles = nodes.map(function(node, index) {
            const key = node.key
            return this.props.isTop && index==nodes.length-1 ?
                [
                    <path d="M 23.937439 14.757364 L 25.511811 15.590551 L 23.937439 16.423738 L 25.301794 17.528372 L 23.590923 18.070866 L 24.693026 19.388608 L 22.89832 19.601716 L 23.696038 21.093675 L 21.890584 20.996844 L 22.363068 22.605279 L 20.610064 22.178863 L 20.725498 23.845436 L 19.109209 23.10908 L 18.867808 24.75601 L 17.440254 23.748406 L 16.852552 25.31795 L 15.666399 24.058545 L 14.7637794 25.511811 L 13.850627 24.058545 L 12.664474 25.31795 L 12.087305 23.748406 L 10.649218 24.75601 L 10.407817 23.10908 L 8.7915283 23.845436 L 8.906962 22.178863 L 7.154173 22.605279 L 7.6264417 20.996844 L 5.8209874 21.093675 L 6.6187063 19.601716 L 4.824 19.388608 L 5.926103 18.070866 L 4.2152315 17.528372 L 5.5795866 16.423738 L 4.015748 15.590551 L 5.5795866 14.757364 L 4.2152315 13.652731 L 5.926103 13.110236 L 4.824 11.7924944 L 6.6187063 11.579386 L 5.8209874 10.087427 L 7.6264417 10.184258 L 7.154173 8.5758236 L 8.906962 9.0022393 L 8.7915283 7.335666 L 10.407817 8.072022 L 10.649218 6.425093 L 12.087305 7.432696 L 12.664474 5.8631527 L 13.850627 7.10331 L 14.753246 5.6692913 L 15.666399 7.10331 L 16.852552 5.8631527 L 17.440254 7.432696 L 18.867808 6.425093 L 19.109209 8.072022 L 20.725498 7.335666 L 20.610064 9.0022393 L 22.363068 8.5758236 L 21.890584 10.184258 L 23.696038 10.087427 L 22.89832 11.579386 L 24.693026 11.7924944 L 23.590923 13.110236 L 25.301794 13.652731 L 23.937439 14.757364 Z"
                          fill="url(#NodeGradient)"/>,
                    <path d="M 23.937439 14.757364 L 25.511811 15.590551 L 23.937439 16.423738 L 25.301794 17.528372 L 23.590923 18.070866 L 24.693026 19.388608 L 22.89832 19.601716 L 23.696038 21.093675 L 21.890584 20.996844 L 22.363068 22.605279 L 20.610064 22.178863 L 20.725498 23.845436 L 19.109209 23.10908 L 18.867808 24.75601 L 17.440254 23.748406 L 16.852552 25.31795 L 15.666399 24.058545 L 14.7637794 25.511811 L 13.850627 24.058545 L 12.664474 25.31795 L 12.087305 23.748406 L 10.649218 24.75601 L 10.407817 23.10908 L 8.7915283 23.845436 L 8.906962 22.178863 L 7.154173 22.605279 L 7.6264417 20.996844 L 5.8209874 21.093675 L 6.6187063 19.601716 L 4.824 19.388608 L 5.926103 18.070866 L 4.2152315 17.528372 L 5.5795866 16.423738 L 4.015748 15.590551 L 5.5795866 14.757364 L 4.2152315 13.652731 L 5.926103 13.110236 L 4.824 11.7924944 L 6.6187063 11.579386 L 5.8209874 10.087427 L 7.6264417 10.184258 L 7.154173 8.5758236 L 8.906962 9.0022393 L 8.7915283 7.335666 L 10.407817 8.072022 L 10.649218 6.425093 L 12.087305 7.432696 L 12.664474 5.8631527 L 13.850627 7.10331 L 14.753246 5.6692913 L 15.666399 7.10331 L 16.852552 5.8631527 L 17.440254 7.432696 L 18.867808 6.425093 L 19.109209 8.072022 L 20.725498 7.335666 L 20.610064 9.0022393 L 22.363068 8.5758236 L 21.890584 10.184258 L 23.696038 10.087427 L 22.89832 11.579386 L 24.693026 11.7924944 L 23.590923 13.110236 L 25.301794 13.652731 L 23.937439 14.757364 Z"
                    stroke="#e7e7e7" strokeOpacity=".511044" strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="6"/>
                ] :
                <circle key={`${key}`} cx={node.x} cy={node.y} r={this.props.circleRadius} fill="#6e2236" stroke="black" strokelinecap="round" strokeLinejoin="round" strokeWidth={`.2%`} />
        }, this).reduce((a, b) => a.concat(b), []);
        return <g>
            <title>Layer 1</title>
            {lineSegments}
            {nodeCircles}
        </g>
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
    // The start x, y position of the line segments.
    x: PropTypes.number,
    y: PropTypes.number,
    // The height of the overall DocumentGraph
    height: PropTypes.number,
    // The normal width of the DocumentGraph
    width: PropTypes.number,
    // The expanded width of the DocumentGraph
    widthExpanded: PropTypes.number,
    // Whether or not the graph is expanded
    isExpanded: PropTypes.bool,
    // Is this the top graph (true) or bottom graph (false)
    isTop: PropTypes.bool,
    // The radius of the node circles
    circleRadius: PropTypes.number,
    // The line radius
    lineRadius: PropTypes.number,
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