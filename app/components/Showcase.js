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

import React, { Component } from 'react'
import Model from './Model3d'
import Media from './Media'
import {connect} from 'react-redux';
import {Map} from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'

// Fraction of space between current model and previous/next when scrolling
const MODEL_PADDING = .1
const MODEL_THRESHOLD = .25

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
        const model = this.props.model
        const media = this.props.model && this.props.model.get('media')
        // Both model and media need to know the calculated model tops.
        // If the next or previous model is at all visible, we don't want to show the media
        const modelTops = this.modelTops()
        return <div className='showcase'>
            <Model model={model} modelKey={this.props.modelKey} modelTops={modelTops}/>
            <Media media={media} modelKey={this.props.modelKey} modelTops={modelTops}/>
        </div>;
    }


    /***
     *
     * Calculate the modelTops of the current, previous, and next models as a percent of how close an anchor element
     * representing them is to document scroll position. This means that
     *  1) the current model display below/above the closer of the previous/netxt model
     *  2) the previous model if any and closer than the next model displays above the current
     *  3) the next model if any and closer than the previous model displays below the current
     *  We also use the constant MODEL_PADDING to separate the bottom and top of two adjacent models.
     *  We also have a threshold MODEL_THRESHOLD before we give the previous or next model a non-null value. We don't want the scroll
     *  to begin immediately because models without scenes or with little text will never be centered otherwise.
     * Previous or next models only show on the top or bottom if they are different models than the current
     * Returns a Map of modelTops for the 'current', 'previous', and 'next' keys.
     * e.g. {current: .25, previous: -.75, null} or {current: 0, previous: null, next: null} or
     * {current: -.25, previous: null, next: .75}
     */
    modelTops() {
        const distances = this.props.closestAnchorDistances
        var tops = {}
        // If we don't have a current model, none of the modelTops matter
        if (distances.get('current') == null) {
            tops = {current: null, previous: null, next: null}
        }
        if (distances.filter(x=>x).count() >= 2) {
            const current = distances.get('current'),
                previous = distances.get('previous'),
                next = distances.get('next')
            const mostRelevant = (previous || Number.MAX_VALUE) < (next || Number.MAX_VALUE) ? 'previous' : 'next';
            // If previous is the closest
            if (mostRelevant == 'previous') {
                // If it's not the same model as current
                if (this.props.models.get('previous') != this.props.models.get('current')) {
                    const total = previous + current
                    const fraction = current / total
                    tops = {
                        // The smaller the distance to previous relative to current,
                        // the more current is pushed down and less negative previous is
                        current: current / total,
                        previous: (1-fraction) > MODEL_THRESHOLD ? (current / total) - 1 - MODEL_PADDING : null,
                        next: null
                    }
                }
            }
            // If next is the closest
            else {
                // If it's not the same model as current
                if (this.props.models.get('next') != this.props.models.get('current')) {
                    const total = next + current
                    const fraction = current / total
                    tops = {
                        // The smaller the distance to next relative to current,
                        // the more current is pushed up and less positive previous is
                        current: 0 - (current / total),
                        previous: null,
                        next: (1-fraction) > MODEL_THRESHOLD ? 1 + MODEL_PADDING - (current / total) : null
                    }
                }
            }
        }
        return tops
    }
}

Showcase.propTypes = {
    model: ImmutablePropTypes.map
}

function mapStateToProps(state) {
    const documentKey = state.getIn(['documents', 'current'])
    // We use this to find out if its time to transition the current model to the next or previous
    // By transition we mean vertical move the current model up or down in the div and start showing
    // the next or previous
    const scrollPosition = state.getIn(['documents', 'entries', documentKey, 'scrollPosition'])
    // Used in conjunction with the scrollPosition to see if it's time to transition
    const closestAnchors = state.getIn(['documents', 'entries', documentKey, 'closestAnchors'])
    const models = documentKey && state.get('models')
    // Calculate the absolute distance from the current, previous, and next anchor to the scroll position
    // The previous/next distance is only valid if the model of the previous/next anchor is different than the current
    // model. If invalid we won't use it, but we still want to record it in case it's closer than the other one
    // (e.g. next might be the same model but closer than previous, which is a different model)
    const closestAnchorDistances = (closestAnchors || Map({})).map(
        (value, key) => value && models.get(key) ?
            Math.abs(scrollPosition - value.offsetTop) : null
    )
    const modelKey = models && models.get('current')
    const model = modelKey && models.getIn(['entries', modelKey])

    return {
        models,
        model,
        modelKey,
        closestAnchorDistances
    }
}

export default connect(mapStateToProps)(Showcase)