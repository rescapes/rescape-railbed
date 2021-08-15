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
import Gallery from './Gallery'
import {normalizeKeyToFilename} from '../utils/fileHelpers'
import ImmutablePropTypes from 'react-immutable-proptypes'

// This garbage has to be done to force webpack to know about all the media files
var req = require.context('../images_dist/', true, /\.(jpg|png|gif)$/)
req.keys().forEach(function(key){
    req(key);
})
var req = require.context('../videos/', true, /\.(webm)$/)
req.keys().forEach(function(key){
    req(key);
})

export default class Media extends Component {
    render() {

        // Other styling is in media.css
        // TODO would all be better off in media.css
        // to match all these items using css regexes, but Lighbox.js generates random class
        // suffixes
        const theme = {

            // arrows
            arrow: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                fill: '#222',
                opacity: 0.6,
                transition: 'opacity 200ms',

                ':hover': {
                    opacity: 1,
                },
            },
            arrow__size__medium: {
                borderRadius: 20,
                height: 20,
                marginTop: -10,

                '@media (min-width: 768px)': {
                    width: 40,
                    height: 40,
                    padding: 10,
                },
            },
            arrow__direction__left: { marginLeft: 0 },
            arrow__direction__right: { marginRight: 0 },

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
                force={this.props.force}
                overlayDocumentIsShowing={this.props.overlayDocumentIsShowing}
                isOpen={this.props.isOpen}
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
            const file = normalizeKeyToFilename(key)
            return {
                // The default size is 1024px
                src: `${dir}/${file}-1024.${type}`,
                thumbnail: `${dir}/${file}-320.${type}`,
                srcset: [
                    //`${dir}/${file}-100pc.${type} 2048w`, // full size image for downloads
                    `${dir}/${file}-1024.${type} 1024w`,
                    //`${dir}/${file}-800.${type} 800w`,
                    //`${dir}/${file}-500.${type} 500w`,
                    `${dir}/${file}-320.${type} 320w`,
                ],
                // We had to add _s to the file names so webpack worked, sigh
                caption: medium.get('caption') || key,
                sourceImageUrl: medium.get('imageSourceUrl'),
                sourceUrl: medium.get('sourceUrl'),
                credit: medium.get('credit'),
                date: medium.get('date')
            }
        }).toArray()
    }
}

Media.propTypes = {
    fade: PropTypes.string,
    toward: PropTypes.string,
    media: ImmutablePropTypes.orderedMap,
    modelKey: PropTypes.string,
    force: PropTypes.bool,
    // The current state of openness of the lightbox
    isOpen: PropTypes.bool,
    overlayDocumentIsShowing: PropTypes.bool
}

