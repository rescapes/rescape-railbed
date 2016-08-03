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

/**
 * Showcase contains the current 3D model and the media associated with the 3D model
 */

import React, { Component, PropTypes } from 'react'
import Model from './Model3d'
import Media from './Media'
import {connect} from 'react-redux';
import {Map} from 'immutable'

class Showcase extends Component {

    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { dispatch, url } = this.props
    }

    render() {

        const style = {
            position: 'fixed',
            top: '100px',
        }

        const model = this.props.model
        const media = this.props.model && this.props.model.media
        return <div style={style}>Showcase
            <Model model={model} />
            <Media media={media}/>
        </div>;
    } 
}

Showcase.propTypes = {
    model: PropTypes.object,
}

function mapStateToProps(state) {
    return {
        model: state.get('model'),
    }
}

export default connect(mapStateToProps)(Showcase)