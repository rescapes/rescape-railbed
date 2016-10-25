/**
 * Created by Andy Likuski on 2016.09.02
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import Lightbox from 'react-images';
import React, { Component, PropTypes } from 'react';

/***
 * Extends Lightbox from react-images to add a credit link an other niceties
 */
class ExtendedLightbox extends Lightbox {

    /***
     * Override the super class method to wrap the images in a div so we can add image credits
     * @returns {*}
     */
    renderImages () {
        const ret = super.renderImages()
        const {
            currentImage,
            images,
        } = this.props;

        if (!images || !images.length) return null;

        const image = images[currentImage];

        const dates = (image.date || '').split(';').map((date, i) => date ?
            <div key={i}>{date}</div> :
            <span key={i} />)

        const sourceUrls = image.sourceUrl.split(',')
        const credits = image.credit.split(',')
        const links = sourceUrls.map((sourceUrl, i) =>
            <a key={credits[i]} target="rescape_source" href={sourceUrls[i]}>{credits[i]}</a>)
        const title = links.length > 1 ? 'Sources:' : 'Source:'
        return <div className='footer-wrapper'>
            {ret}
            <span className='image-credit'>
                <i>{title} </i>
                {this.intersperse(links, ' and ')}
                <span className='image-date'>{this.intersperse(dates, ' and ')}</span>
            </span>
        </div>
    }
    /*
     * http://stackoverflow.com/questions/23618744/rendering-comma-separated-list-of-links
     * intersperse: Return an array with the separator interspersed between
     * each element of the input array.
     *
     * > _([1,2,3]).intersperse(0)
     * [1,0,2,0,3]
     */
    intersperse(arr, sep) {
        if (arr.length === 0) {
            return [];
        }

        return arr.slice(1).reduce(function(xs, x, i) {
            return xs.concat([sep, x]);
        }, [arr[0]]);
    }
}

export default ExtendedLightbox
