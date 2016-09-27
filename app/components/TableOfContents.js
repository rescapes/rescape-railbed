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
import DocumentGraphLineSegments from './DocumentGraphLineSegments';
import DocumentGraphNode from './DocumentGraphNode';
import {OrderedMap, Map, List} from 'immutable'
import * as documentActions from '../actions/document'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import {normalizeModelName} from '../utils/modelHelpers'


/***
 * Shows the Model3ds of the current Document and will in the future show other documents
 */
class TableOfContents extends React.Component {

    /***
     * The total number of objects above of below the current model
     * @returns {*}
     */
    getTotalObjectCount() {
        const anchorNames = this.props.document.get('anchorToModels').keySeq().map(anchor => anchor.get('name'))
        const normalizedModelName = normalizeModelName(this.props.modelKey)
        const modelsForPosition = this.props.isTop ?
            anchorNames.slice(0, anchorNames.indexOf(normalizedModelName) + 1).reverse() :
            anchorNames.slice(anchorNames.indexOf(normalizedModelName) + 1)
        // Nodes are the document (top only) plus the models.
        return new List(
            this.props.isTop ? [this.props.documentTitle] : []
        ).concat(modelsForPosition).count()
    }

    /***
     * All of the models before and including the current or all of the models after the current
     * If this is the top graph reverse the items so we go from the current toward the beginning
     * Models are grouped together that have the same anchor representation
     **/
    getObjects() {
        const normalizedModelName = normalizeModelName(this.props.modelKey)
        // We only want the first model of each anchor. This avoids separate of contents entries for grouped models.
        const allModels = OrderedMap(this.props.document.get('anchorToModels').entrySeq().map(([anchor, models]) =>
            // Return the anchor name and first Model
            [anchor.get('name'), models.entrySeq().first()[1]]
        ))
        const modelsForPosition = this.props.isTop ?
            allModels.slice(0, allModels.keySeq().indexOf(normalizedModelName) + 1).reverse() :
            allModels.slice(allModels.keySeq().indexOf(normalizedModelName) + 1)
        // Reduce the models to our table of contents settings length unless we are expanded
        const maxNodeCount = this.props.settings.get('TABLE_OF_CONTENTS_MODEL_NODE_COUNT')
        const models = this.props.isExpanded ? allModels : modelsForPosition.slice(
            0,
            maxNodeCount
        )
        // Nodes are the document (top only) plus the models.
        return this.props.isTop ?
            (this.props.isExpanded ?
                // document first
                new OrderedMap({[this.props.documentTitle]: this.props.document}).merge(models) :
                // document last
                models.set(this.props.documentTitle, this.props.document)):
            (modelsForPosition.count() > maxNodeCount ? models.set('end', null) : models)
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
        const extraLengthForDocument = this.props.isTop ? 6 : 0
        const segmentLength = (totalLength-extraLengthForDocument) / (objects.count()-1)

        //const theta = Math.atan(isExpanded ? Infinity : height / width);
        // Lets make the line always vertical. The code above can be used to slope it
        //const theta = Math.atan(Infinity)
        // Apply the extra length if going downward and the document was the previous node
        // or apply if going upward and the document is the current node
        const documentTitleIndex = objects.keySeq().indexOf(this.props.documentTitle)
        const applyExtraLengthAtIndex = !this.props.isTop ?
            null :
            (yDirection == 1 ? documentTitleIndex + 1 : documentTitleIndex)

        return objects.entrySeq().map(([key, obj], i) => {
            // Apply extra space for the document once we get to the node before or after it
            const length = i * segmentLength + (i >= applyExtraLengthAtIndex ? extraLengthForDocument : 0)
            const xi = 0 //x - length * Math.cos(theta)
            const yi = y + yDirection * length //Math.sin(theta)
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
            left: `${Math.abs(node2.x + node1.x) * .65}%`,
            top: `${Math.abs(node2.y + node1.y) * .65}%`
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
        const documentGraphCircles = nodes.map((node, index) =>
            <DocumentGraphNode
                key={node.key}
                node={node}
                index={index}
                isExpandedByHover={this.props.isExpandedByHover}
                {...modifiedProps} />, this)

        const documentGraphCircleGroup = <ReactCSSTransitionGroup
            transitionName="table-of-contents-nodes"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}>
            {documentGraphCircles}
        </ReactCSSTransitionGroup>

        // Get the number of models not showing because they don't fit
        const hiddenModelsCount = totalNodeCount - nodes.length;
        const hiddenModelDom = !this.props.isExpanded && hiddenModelsCount ?
            <div style={this.calculateHiddenModelDomPosition(...nodes.slice(-2))}
                 className="table-of-contents-node hidden-model-count">
                <div className='outline'>
                    {hiddenModelsCount} More...
                </div>
            </div> :
            <div/>

        return <div className={`table-of-contents ${this.props.isTop ? 'top': 'bottom'} ${this.props.isExpanded ? 'expanded' : ''}`}
                    onMouseLeave={()=>this.props.toggleTableOfContents(this.props.documentKey, false, true)}
        >
            <DocumentGraphLineSegments {...Object.assign({},
                    modifiedProps,
                    {viewboxWidth: this.props.containerWidth,
                    viewboxHeight: this.props.containerHeight,
                    lineRadius: 5 }) } />
            <div className="document-graph-circles">
                {documentGraphCircleGroup}
                {hiddenModelDom}
            </div>
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
    isExpandedByHover: PropTypes.bool,
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
    const isExpandedByHover = document.get('tableOfContentIsExpandedByHover')
    return {
        settings,
        documents,
        document,
        documentKey,
        models,
        modelKey,
        documentTitle,
        isExpanded,
        isExpandedByHover
    }
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 */
export default connect(
    mapStateToProps,
    documentActions
)(TableOfContents)
