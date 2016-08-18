/**
 * Created by Andy Likuski on 2016.06.01
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
import {connect} from 'react-redux';
import Lightbox from 'react-lightbox';

class Controls extends Component {
    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }

    render() {
        return <div className='my-controls'>
            <div className='my-button my-button-left' onClick={this.props.backward}></div>
            <div className='my-button my-button-left' onClick={this.props.forward}></div>
        </div>
    }
}

class Media extends Component {
    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }

    render() {
        return <div className='media'>
            <Lightbox pictures={[
            'https://pbs.twimg.com/profile_images/269279233/llama270977_smiling_llama_400x400.jpg',
            'https://pbs.twimg.com/profile_images/1905729715/llamas_1_.jpg',
            'http://static.comicvine.com/uploads/original/12/129924/3502918-llama.jpg',
            'http://fordlog.com/wp-content/uploads/2010/11/llama-smile.jpg'
        ]}
             keyboard
             controls={Controls}
            />
        </div>
    }
}

Media.propTypes = {
    media: PropTypes.object,
}

function mapStateToProps(state) {
    return {
        media: state.get('media'),
    }
}

export default connect(mapStateToProps)(Media)
