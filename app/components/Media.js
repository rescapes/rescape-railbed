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

// This garbage has to be done to force webpack to know about all the media files
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

        // to match all these items using css regexes, but Lighbox.js generates random class
        // suffixes
        const theme = {

            // arrows
            arrow: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                fill: '#222',
                opacity: 0.6,
                transition: 'opacity 200ms',

                ':hover': {
                    opacity: 1,
                },
            },
            arrow__size__medium: {
                borderRadius: 40,
                height: 40,
                marginTop: -20,

                '@media (min-width: 768px)': {
                    height: 70,
                    padding: 15,
                },
            },
            arrow__direction__left: { marginLeft: 10 },
            arrow__direction__right: { marginRight: 10 },

            // header
            close: {
                fill: '#D40000',
                opacity: 0.6,
                transition: 'all 200ms',

                ':hover': {
                    opacity: 1,
                },
            },

            // footer
            footer: {
                color: 'black',
            },
            footerCount: {
                color: 'rgba(0, 0, 0, 0.6)',
            },

            // thumbnails
            thumbnail: {
            },
            thumbnail__active: {
                boxShadow: '0 0 0 2px #00D8FF',
            },
        }
        return <div className={`media ${this.props.fade} ${this.props.toward}`}>
            <Gallery
                images={this.configureMedia()}
                theme={theme}
            />
        </div>
    }

    /***
     * Configures the list of Medium maps for display in the Gallery
     */
    configureMedia() {
        // dir is a flat directory because webpack builds the images to this flat dir
        const dir = '../images'
        const media = this.props.media || Map({})
        return media.map(function(medium, key) {
            const type = medium.get('type') || 'jpg'
            // We can't use spaces in our file names, it confuses babel or webpack or something
            const file = key.replace(/ /g, '_')
            return {
                src: `${dir}/${file}-800.${type}`,
                thumbnail: `${dir}/${file}-320.${type}`,
                srcset: [
                    `${dir}/${file}-1024.${type} 1024w`,
                    `${dir}/${file}-800.${type} 800w`,
                    `${dir}/${file}-500.${type} 500w`,
                    `${dir}/${file}-320.${type} 320w`,
                ],
                // We had to add _s to the file names so webpack worked, sigh
                caption: medium.get('caption') || file.replace(/_/g, ' '),
                sourceImageUrl: medium.get('imageSourceUrl'),
                sourceUrl: medium.get('sourceUrl'),
                credit: medium.get('credit'),
                date: medium.get('date')
            }
        }).toArray()
    }
}

Media.propTypes = {
}

function mapStateToProps(state) {
    return {
    }
}

export default connect(mapStateToProps)(Media)
