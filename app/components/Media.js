/**
 * Created by Andy Likuski on 2016.08.18
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { Component, PropTypes } from 'react'
import {Map} from 'immutable'
import {connect} from 'react-redux'
import Gallery from './Gallery'
import ImmutablePropTypes from 'react-immutable-proptypes'

var req = require.context('../images/', true, /\.(jpg|png)$/)
req.keys().forEach(function(key){
    req(key);
})

function capitalizeFirstLetter (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
const IMAGE_NAMES = ['cat', 'cats', 'chameleon', 'dog', 'ducks', 'goat', 'ostrich']
const IMAGE_MAP = IMAGE_NAMES.map(img => ({
    src: `../images/samples/800-${img}.jpg`,
    thumbnail: `../images/samples/thumbnail-${img}.jpg`,
    srcset: [
        `../images/1024-${img}.jpg 1024w`,
        `../images/800-${img}.jpg 800w`,
        `../images/500-${img}.jpg 500w`,
        `../images/320-${img}.jpg 320w`,
    ],
    caption: capitalizeFirstLetter(img),
    sourceUrl: '',
    credit: ''
}))

class Media extends Component {
    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }

    render() {
        const fade = ['previous', 'next'].some(relevance => this.props.modelTops[relevance]) ? 'fade-out' : 'fade-in'
        return <div className={`media ${fade}`}>
            <Gallery images={this.props.images} />
        </div>
    }
}

Media.propTypes = {
    media: ImmutablePropTypes.list,
    images: ImmutablePropTypes.list,
}

function mapStateToProps(state) {
    return {
        media: state.get('media'),
        images: state.getIn([])
    }
}

export default connect(mapStateToProps)(Media)
