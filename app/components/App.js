/**
 * Created by Andy Likuski on 2016.05.23
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/***
 * The App container. It is responsible for rendering the matching route
 */
// Do this once before any other code in your app (http://redux.js.org/docs/advanced/AsyncActions.html)
import 'babel-polyfill'
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom';
import * as actions from '../actions/document'
import {connect} from 'react-redux';
import DeviceOrientation, { Orientation } from 'react-screen-orientation'
import {isBrowser} from '../utils/appHelpers'
import ImmutablePropTypes from 'react-immutable-proptypes'

// The children are the components of the chosen route
class App extends Component {

    componentDidMount() {
        this.props.setDocumentLocation(this.props.location)
    }
    componentWillReceiveProps(nextProps){
        // Set the current document
        if (this.props.documentKey != nextProps.documentKey)
            this.props.showDocument(nextProps.documentKey)

        // If the location hash came in the URL set that
        if (this.props.location.hash != nextProps.location.hash) {
            this.props.setDocumentLocation(nextProps.location)
        }
    }


    render() {
        if (!isBrowser()['isSafari']) {
            return <DeviceOrientation lockOrientation={'landscape'}>
                {/* Will only be in DOM in landscape */}
                <Orientation orientation='landscape' alwaysRender={false}>
                    {React.cloneElement(this.props.children, {})}
                </Orientation>
                {/* Will stay in DOM, but is only visible in portrait */}
                <Orientation orientation='portrait' alwaysRender={false}>
                    <div>
                        {React.cloneElement(this.props.children, {})}
                        <div className="please-rotate"><span>Please rotate your device</span></div>
                    </div>
                </Orientation>
            </DeviceOrientation>
        }
        else {
            switch (this.props.orientation) {
                case undefined:
                case -90:
                case 90:
                    return React.cloneElement(this.props.children, {})
                default:
                    return <div>
                        {React.cloneElement(this.props.children, {})}
                        <div className="please-rotate"><span>Please rotate your device</span></div>
                    </div>
            }
        }
    }
};

App.PropTypes = {
    documentKey: PropTypes.string,
    document: ImmutablePropTypes.map,
    location: React.PropTypes.object,
    orientation: React.PropTypes.bool
}

function mapStateToProps(state, props) {

    // The key of the document if one was specified in the URL
    const splat = props.params.splat
    const documents = state.getIn(['documents', 'entries'])

    let document = null
    if (splat && documents.get(splat)) {
        document = documents.get(splat)
    }
    else {
        // Load and show the newest post that isn't marked in the future
        // TODO this will need to be used by a post listing
        const sortedDocuments = state.getIn(['documents', 'entries']).sort(
            (a, b) => a.get('date') > b.get('date'))
        const now = new Date();
        // Get the newest document. Ignore documents like About and Contact that have no date
        document = sortedDocuments.reverse().find(document => document.get('date') && document.get('date') <= now)
    }
    // Add the window.orientation so we can detect orientation in iOS devices
    return Object.assign(state.toObject(), {
        documentKey: documents.keyOf(document),
        document: document,
        orientation: window.orientation
    })

}

export default connect(
    mapStateToProps,
    actions
)(App)
