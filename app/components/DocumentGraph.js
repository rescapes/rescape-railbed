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
import DocumentGraphLine from './DocumentGraphLine';
import DocumentGraphCircle from './DocumentGraphCircle';
import {OrderedMap, Map, List} from 'immutable'
import * as documentActions from '../actions/document'


/***
 * Shows the Model3ds of the current Document and will in the future show other documents
 */
class DocumentGraph extends React.Component {

    componentDidMount() {
        this.setUnknownAttributes()
    }

    componentWillReceiveProps() {
        this.setUnknownAttributes()
    }

    /***
     * Show the comments when the user clicks the comment count button
     */
    onClickExpandButton() {
        this.props.toggleTableOfContents(this.props.documentKey, true)
    }

    /***
     * Hide the comments when the user clicks the close button
     */
    onClickCollapseButton() {
        this.props.toggleTableOfContents(this.props.documentKey, false)
    }

    /***
     * Set svg attributes that React can't handle
     * @returns {XML}
     */
    setUnknownAttributes() {
        if (this.refs.radialGradient)
            this.refs.radialGradient.setAttribute('xl:href', "#Gradient")
    }

    getTotalObjectCount() {
        const allModels = this.props.models.get('entries')
        const modelsForPosition = this.props.isTop ?
            allModels.slice(0, allModels.keySeq().indexOf(this.props.modelKey) + 1).reverse() :
            allModels.slice(allModels.keySeq().indexOf(this.props.modelKey) + 1)
        // Nodes are the document (top only) plus the models.
        return new OrderedMap(
            this.props.isTop ? {[this.props.documentTitle]: this.props.document} : {}
        ).concat(modelsForPosition).count()
    }

    /***
     * All of the models before and including the current or all of the models after the current
     * If this is the top graph reverse the items so we go from the current toward the beginning
     **/
    getObjects() {
        const allModels = this.props.models.get('entries')
        const modelsForPosition = this.props.isTop ?
            allModels.slice(0, allModels.keySeq().indexOf(this.props.modelKey) + 1).reverse() :
            allModels.slice(allModels.keySeq().indexOf(this.props.modelKey) + 1)
        // Reduce the models to our table of contents settings length unless we are expanded
        const models = this.props.isExpanded ? allModels : modelsForPosition.slice(
            0,
            this.props.settings.get('TABLE_OF_CONTENTS_MODEL_NODE_COUNT')
        )
        // Nodes are the document (top only) plus the models.
        return this.props.isTop ?
            (this.props.isExpanded ?
                // document first
                new OrderedMap({[this.props.documentTitle]: this.props.document}).merge(models) :
                // document last
                models.set(this.props.documentTitle, this.props.document)):
            models
    }

    /***
     * Map the objects to nodes with x and y positions
     * @param objects
     * @returns {*}
     */
    getNodes(objects) {
        // We will use percentages for SVG since the viewBox takes care of the scaling
        //
        const x = 0,
            // If we are the top contents and not expanded. Start y at 100 and go to 0. Otherwise go from 0 to 100
            y = this.props.isTop && !this.props.isExpanded ? 100 : 0,
            width=100, height=100,
            // The top graph goes up when not expanded (-y) the bottom graph goes down (+y).
            yDirection = this.props.isTop && !this.props.isExpanded ? -1 : 1

        // Move to the starting position
        // The width of the graph is longer when expanded
        // Reduce the width and height somewhat so the nodes at the end fit with the viewBox
        // Assume no slope so x is 0
        const totalLength = Math.sqrt(Math.pow(0, 2) + Math.pow(height, 2))

        // The segment length for the line
        // If the document is connected, allocate extra length for it
        const extraLengthForDocument = this.props.isTop ? 2 : 0
        const segmentLength = (totalLength-extraLengthForDocument) / (objects.count()-1)

        //const theta = Math.atan(isExpanded ? Infinity : height / width);
        // Lets make the line always vertical. The code above can be used to slope it
        const theta = Math.atan(Infinity)
        return objects.entrySeq().map(([key, obj], i) => {
            // Apply the extra length if going downward and the document was the previous node
            // or apply if going upward and the document is the current node
            const applyExtraLength = this.props.isTop &&
                (yDirection == 1 && i > 0 && objects.keySeq().get(yDirection == 1 ? i-1 : i) == this.props.documentTitle)
            // If this is the document connector, make it longer (i.e. the total length)
            const length = applyExtraLength ?
                i * segmentLength + extraLengthForDocument :
                i * segmentLength
            const xi = x - length * Math.cos(theta)
            const yi = y + yDirection * length * Math.sin(theta)
            return { x:xi, y:yi, key: key, obj: obj}
        }, List()).toArray()
    }

    /**
     * Finds the "middle" of the last segment for positioning the hiddenModelDom div
     * @param node1
     * @param node2
     * @returns {{x: number, y: number}}
     */
    calculateHiddenModelDomPosition(node1, node2) {
        return {
            left: `${Math.abs(node2.x - node1.x) * .65}%`,
            top: `${Math.abs(node2.y - node1.y) * .65}%`
        }
    }

    render() {
        const objs = this.getObjects()
        const nodes = this.getNodes(objs)
        const totalNodeCount = this.getTotalObjectCount()
        // Set the width based on whether or not the graph is expanded
        const modifiedProps =  Object.assign({},
            this.props,
            {nodes: nodes, totalNodeCount: totalNodeCount, width: 100,  height: 100, x: 0, y: 0,
             toggleTableOfContents: this.props.toggleTableOfContents
            }
        )
        const documentGraphCircles = nodes.map(function(node, index) {
            return <DocumentGraphCircle
                key={node.key}
                node={node}
                index={index}
                {...modifiedProps} />
        })

        // Get the number of models not showing because they don't fit
        const hiddenModelsCount = totalNodeCount - nodes.length;
        const hiddenModelDom = hiddenModelsCount ?
            <div style={this.calculateHiddenModelDomPosition(...nodes.slice(-2))}
                 className="table-of-contents-node hidden-model-count">
                <div className='outline'>
                    {hiddenModelsCount} More...
                </div>
            </div> :
            <div/>

        return <div className={`table-of-contents ${this.props.isTop ? 'top': 'bottom'} ${this.props.isExpanded ? 'expanded' : ''}`}>
            <DocumentGraphLine {...Object.assign({},
                    modifiedProps,
                    {viewboxWidth: this.props.containerWidth,
                    viewboxHeight: this.props.containerHeight,
                    lineRadius: 2 }) } />
            <div onClick={this.onClickExpandButton.bind(this)} className="document-graph-circles">
                {documentGraphCircles}
                {hiddenModelDom}
            </div>
        </div>
    }
}

DocumentGraph.propKeys = {
    documents: ImmutablePropTypes.map,
    documentTitle: PropTypes.string,
    documentKey: PropTypes.string,
    modelKey: PropTypes.string,
    models: ImmutablePropTypes.map,
    model: ImmutablePropTypes.map,
    isExpanded: PropTypes.bool,
    isTop: PropTypes.bool,
    // The height of the container
    containerHeight: PropTypes.number,
    // The width of the container
    containerWidth: PropTypes.number,
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
 */
export default connect(
    mapStateToProps,
    documentActions
)(DocumentGraph)
