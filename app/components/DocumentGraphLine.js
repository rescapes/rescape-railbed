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

    prepareData() {

        const x = this.props.x
        const y = this.props.y
        // Move to the starting position
        const start = [`M ${x} ${y}`];
        // The width of the graph is longer when expanded
        const width = this.props.isExpanded ? this.props.widthExpanded : this.props.width
        const height = this.props.height
        const theta = 1 * this.props.height / width;
        const length = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
        // All of the models before and including the current or all of the models after the current
        // If this is the top graph reverse the items so we go from the current toward the beginning
        const allModels = this.props.models.get('entries')
        const modelsForPosition = this.props.isTop ?
            allModels.slice(0, allModels.keySeq().indexOf(this.props.modelKey) + 1).reverse() :
            allModels.slice(allModels.keySeq().indexOf(this.props.modelKey) + 1)
        // Reduce the models to 3 unless we are expanded
        const models = this.props.isExpanded ? modelsForPosition : modelsForPosition.slice(0,3)
        // Nodes are the document (top only) plus the models.
        const nodes = new OrderedMap(
            this.props.isTop ? {[this.props.documentTitle]: this.props.document} : {}
        ).concat(models)

        // The segment length for the line
        const segmentLength = length / nodes.length-1

        // The top graph goes up (-y) the bottom graph goes down (+y). They both go left
        const yDirection = this.props.isTop ? -1 : 1
        return [start].concat(
            models.map((model, i) => {
                const xi = x - ((i+1) * segmentLength) * Math.cos(theta)
                const yi = y + yDirection * ((i+1) * segmentLength) * Math.sin(theta)
                return `L ${xi} ${yi}`
            })
        );
    }

    render() {
        let d = this.prepareData();
        return(
            <path d={d}
                  stroke="orange"
                  strokeWidth={1}
                  fill="none"
            />
        )
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
        documentTitle
    }
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 */
export default connect(
    mapStateToProps,
)(DocumentGraphLine)