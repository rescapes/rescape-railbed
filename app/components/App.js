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

// The children are the components of the chosen route
class App extends Component {

    componentDidMount() {
        this.props.setDocumentLocation(this.props.location)
    }
    componentWillReceiveProps(nextProps){
        if (this.props.location.hash != nextProps.location.hash) {
            this.props.setDocumentLocation(nextProps.location)
        }
    }

    isBrowser() {
        const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0
        const isIE = !!document.documentMode
        const isChrome = !!window.chrome && !!window.chrome.webstore
        return {
            // Opera 8.0+
            isOpera: isOpera,
            // Firefox 1.0+
            isFirefox: typeof InstallTrigger !== 'undefined',
            // Safari <= 9 "[object HTMLElementConstructor]"
            isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
            // Internet Explorer 6-11
            isIE: isIE,
            // Edge 20+
            isEdge: !isIE && !!window.StyleMedia,
            // Chrome 1+
            isChrome: isChrome,
            // Blink engine detection
            isBlink: (isChrome || isOpera) && !!window.CSS
        }
    }

    render() {
        if (!this.isBrowser()['isSafari']) {
            return <DeviceOrientation lockOrientation={'landscape'}>
                {/* Will only be in DOM in landscape */}
                <Orientation orientation='landscape' alwaysRender={false}>
                    {React.cloneElement(this.props.children, {})}
                </Orientation>
                {/* Will stay in DOM, but is only visible in portrait */}
                <Orientation orientation='portrait'>
                    <div className="please-rotate">
                        <p>Please rotate your device</p>
                    </div>
                </Orientation>
            </DeviceOrientation>
        }
        else {
            switch (window.orientation) {
                case -90:
                case 90:
                    return React.cloneElement(this.props.children, {})
                default:
                    return <div className="please-rotate">
                        <p>Please rotate your device</p>
                    </div>
            }
        }
    }
};

App.PropTypes = {
    location: React.PropTypes.object,
    orientation: React.PropTypes.string
}

function mapStateToProps(state) {
    return Object.assign(state.toObject(), {orientation: window.orientation})
}

export default connect(
    mapStateToProps,
    actions
)(App)
