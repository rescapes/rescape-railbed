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

class ExtendedLighboxFooter extends Component {

}

/***
 * Extends Lightbox from react-images to add a credit link an other niceties
 */
class ExtendedLightbox extends Lightbox {

    renderImages () {
        const ret = super.renderImages()
        const {
            currentImage,
            images,
        } = this.props;

        if (!images || !images.length) return null;

        const image = images[currentImage];

        const date = image.date ?
            <div>{image.date}</div> :
            <span/>

        const sourceUrls = image.sourceUrl.split(' and ')
        const credits = image.credit.split(' and ')
        const links = sourceUrls.map((sourceUrl, i) => <a target="rescape_source" href={image.sourceUrl}>{credits[i]}</a>)
        return <div className='footerWrapper'>
            {ret}
            <span className='image-credit'>
                <i>Source: </i>
                {links}
                <span className='image-date'>{date}</span>
            </span>
        </div>
    }
}

export default ExtendedLightbox
