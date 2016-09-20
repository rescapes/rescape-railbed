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
import DocumentGraphNodes from './DocumentGraphNodes';

/***
 * Shows the Model3ds of the current Document and will in the future show other documents
 */
class DocumentGraph extends React.Component {

    render() {
        return (
            <svg viewBox={`0 0 ${this.props.width} ${this.props.height}`}
                 preserveAspectRatio="xMinYMin meet"
            >
                <defs>
                    <font-face fontFamily="Hannotate SC" fontSize="73" panose-1="3 0 7 0 0 0 0 0 0 0" unitsPerEm="1000"
                               underlinePosition="-100" underlineThickness="50" slope="0" x-height="600" capHeight="860"
                               ascent="1060.00215" descent="-340.00069" fontWeight="bold">
                        <font-face-src>
                            <font-face-name name="HannotateSC-W7"/>
                        </font-face-src>
                    </font-face>
                    <font-face fontFamily="Raleway" fontSize="36" panose-1="2 11 5 3 3 1 1 6 0 3" unitsPerEm="1000"
                               underlinePosition="-75" underlineThickness="50" slope="0" x-height="530" capHeight="715"
                               ascent="940.00244" descent="-233.99353" fontWeight="500">
                        <font-face-src>
                            <font-face-name name="Raleway-Regular"/>
                        </font-face-src>
                    </font-face>
                    <font-face fontFamily="Raleway" fontSize="67" panose-1="2 11 5 3 3 1 1 6 0 3" unitsPerEm="1000"
                               underlinePosition="-75" underlineThickness="50" slope="0" x-height="530" capHeight="715"
                               ascent="940.00244" descent="-233.99353" fontWeight="500">
                        <font-face-src>
                            <font-face-name name="Raleway-Regular"/>
                        </font-face-src>
                    </font-face>
                    <radialGradient id="NodeGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(1082.83464 411.02362) scale(50.15)"
                    >
                        <stop offset="0" stopColor="#fefdf9"/>
                        <stop offset=".6091919" stopColor="#e76465"/>
                        <stop offset="1" stopColor="#dc1734" />
                    </radialGradient>
                    <font-face fontFamily="Raleway" fontSize="25" panose-1="2 11 5 3 3 1 1 6 0 3" unitsPerEm="1000"
                               underlinePosition="-75" underlineThickness="50" slope="0" x-height="530" capHeight="715"
                               ascent="940.00244" descent="-233.99353" fontWeight="500">
                        <font-face-src>
                            <font-face-name name="Raleway-Regular"/>
                        </font-face-src>
                    </font-face>
                </defs>
                <g stroke="none" strokeOpacity="1" strokeDasharray="none" fill="solid" fillOpacity="1">
                    <title>Canvas 1</title>
                    <DocumentGraphLine {...this.props} />
                </g>
                <DocumentGraphNodes {...this.props} />
            </svg>
        )
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
    // The start x, y position of the line segments.
    x: PropTypes.number,
    y: PropTypes.number,
    // The height of the overall DocumentGraph
    height: PropTypes.number,
    // The normal width of the DocumentGraph
    width: PropTypes.number,
    // The expanded width of the DocumentGraph
    widthExpanded: PropTypes.number,
    // The radius of the node circles
    circleRadius: PropTypes.number
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
)(DocumentGraph)
