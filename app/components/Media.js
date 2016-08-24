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

var req = require.context('../images_dist/', true, /\.(jpg|png|gif)$/)
req.keys().forEach(function(key){
    req(key);
})

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
        // dir is a flat directory because webpack builds the images to this flat dir
        const dir = '../images/'
        const media = this.props.media || Map({})
        return media.map(function(medium, key) {
            const type = medium.type || 'jpg'
            return {
                src: `${dir}/${key}-800.${type}`,
                thumbnail: `${dir}/${key}-thumbnail.${type}`,
                srcset: [
                    `${dir}/${key}-1024.${type} 1024w`,
                    `${dir}/${key}-800.${type} 800w`,
                    `${dir}/${key}-500.${type} 500w`,
                    `${dir}/${key}-320.${type} 320w`,
                ],
                caption: key,
                imageSourceUrl: medium.get('imageSourceUrl'),
                sourceUrl: medium.get('sourceUrl'),
                credit: medium.get('credit'),
                date: medium.get('date')
            }
        }).toArray()
    }
}

Media.propTypes = {
    media: ImmutablePropTypes.list,
}

function mapStateToProps(state) {
    return {
    }
}

export default connect(mapStateToProps)(Media)
