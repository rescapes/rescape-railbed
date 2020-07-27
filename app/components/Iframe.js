/**
 * Created by Andy Likuski on 2016.06.07
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import PropTypes from 'prop-types';
import React, { Component} from 'react'

// https://gist.github.com/iest/3b571a6ddcdd9ddab3cf
class Iframe extends Component {

    componentDidMount() {
        //this.refs.iframe.getDOMNode().addEventListener('load', this.props.onLoad)
    }

    render() {
        return <iframe
           frameBorder="0"
           scrolling="no"
           marginHeight="0"
           marginWidth="0"
           allowFullScreen="false"
            {...this.props}
        />
    }
}

Iframe.propTypes = {
    src: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    onLoad: PropTypes.func
}

export default Iframe
