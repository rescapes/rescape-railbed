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
            <Gallery images={this.configureMedia()} />
        </div>
    }

    /***
     * Configures the list of Medium maps for display in the Gallery
     */
    configureMedia() {

        const dir = `../images/${this.props.modelKey}`
        const type = this.props.media.type || 'jpg'
        return this.props.media.map(media => ({
            src: `${dir}/800-${img}.${type}`,
            thumbnail: `${dir}/thumbnail-${img}.${type}`,
            srcset: [
                `${dir}/1024-${img}.${type} 1024w`,
                `${dir}/800-${img}.${type} 800w`,
                `${dir}/500-${img}.${type} 500w`,
                `${dir}/320-${img}.${type} 320w`,
            ],
            caption: capitalizeFirstLetter(img),
            sourceUrl: '',
            credit: ''
        }))    }
}

Media.propTypes = {
    media: ImmutablePropTypes.list,
}

function mapStateToProps(state) {
    return {
    }
}

export default connect(mapStateToProps)(Media)
