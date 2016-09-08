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
import ImmutablePropTypes from 'react-immutable-proptypes'
import * as siteActions from '../actions/site'
import * as settingsActions from '../actions/settings'
import { ShareButtons, generateShareIcon } from 'react-share';

// Fraction of space between current model and previous/next when scrolling
// TODO move to settings
const MODEL_PADDING = .1
const MODEL_THRESHOLD = .25
const {
    FacebookShareButton,
    TwitterShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    PinterestShareButton,
    VKShareButton
} = ShareButtons;

const SHARE_ICONS = ['facebook', 'twitter', 'google', 'linkedin', 'pinterest', 'vk'].map(
   key => generateShareIcon(key)
)
const SHARE_BUTTONS = [FacebookShareButton, TwitterShareButton, GooglePlusShareButton, LinkedinShareButton, PinterestShareButton, VKShareButton]

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
        const modelKey = this.props.modelKey
        const documentTitle = this.props.documentTitle
        const media = this.props.model && this.props.model.get('media')
        // Both model and media need to know the calculated model tops.
        // If the next or previous model is at all visible, we don't want to show the media
        const modelTops = this.modelTops()
        const [fade, toward] = this.calculateModelFadeAndToward(modelTops)
        const shareTitle = `${documentTitle} (${modelKey})`
        if (!this.props.postUrl) {
            return  <div className='showcase'/>
        }
        return <div className='showcase'>
            <Model model={model} modelKey={this.props.modelKey} modelTops={modelTops} />
            <Media media={media} modelKey={this.props.modelKey} fade={fade} toward={toward}/>
            // Share icons!
            <div className={`share-icons ${fade} ${toward}`}>
                {SHARE_BUTTONS.map((shareButton, i) =>
                    // TODO need a media URL for pinterest. Need scene-specific urls
                    React.createElement(shareButton, {key:i, title: shareTitle, url: this.props.postUrl },
                        // size: null keeps the icons from setting there style width/height
                        // so that we can do it with css
                        React.createElement(SHARE_ICONS[i], {key:i, size:null, round:true })
                    )
                )}
            </div>
            // Use the specially defined title to show the model, or lacking one the model key
            // Apply fade aways for the title, including if the lightbox is open
            <div className={`model-3d-title ${this.props.lightboxVisibility ? 'fade-out' : fade} ${toward}`}>
                {model && model.get('title') || modelKey}
            </div>
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
     * e.g. {current: .25, previous: -.75-MODEL_PADDING, null} or {current: 0, previous: null, next: null} or
     * {current: -.25, previous: null, next: .75+MODEL_PADDING}
     */
    modelTops() {
        const distances = this.props.closestAnchorDistances
        // If we don't have a current model, none of the modelTops matter
        if (distances.get('current') == null) {
            return {current: null, previous: null, next: null}
        }
        const current = this.props.models.get('current'),
            currentDistance = distances.get('current'),
            previousDistance = distances.get('previousForDistinctModel'),
            nextDistance = distances.get('nextForDistinctModel'),
            // Increases as previous becomes more relevant
            previousFraction = currentDistance / (previousDistance + currentDistance),
            // Increases as next becomes more relevant
            nextFraction = currentDistance / (nextDistance + currentDistance)
        if (previousFraction > MODEL_THRESHOLD && this.props.models.get('previousForDistinctModel') != current) {
            return {
                // Start at 0 and scroll down as previous gets more relevant
                current: currentDistance / (previousDistance + currentDistance),
                // Start at above showcase at -(MODEL_PADDING + 1) and scroll down as previous gets more relevant
                previous: previousFraction - (MODEL_PADDING + 1),
                next: null
            }
        }
        else if (nextFraction > MODEL_THRESHOLD && this.props.models.get('nextForDistinctModel') != current) {
            return {
                // Start at 0 and scroll up as next gets more relevant
                current: 0 - (currentDistance / (nextDistance + currentDistance)),
                previous: null,
                // Start at 1 + MODEL_PADDING below screen and scroll up as next gets more relevant
                next: (1 + MODEL_PADDING) - nextFraction
            }
        }
        else {
            return {
                current: 0,
                previous: null,
                next: null
            }
        }

    }

    /***
     * If we previous or next models are present we want to fade out since the current model
     * is no longer centered
     *
     * @param modelTops
     * @returns {[fade, toward]}
     */
    calculateModelFadeAndToward(modelTops) {
        const fade = ['previous', 'next'].some(relevance => modelTops[relevance]) ?
            'fade-out' :
            'fade-in'
        // Fade the media in the direction that the current model is scrolling, which is based
        // on which mode is closer, previous or next.
        const toward = fade == 'fade-in' ?
            '' :
            (modelTops['next'] ?
                'upward' :
                'downward')
        return [fade, toward]
    }
}

Showcase.propTypes = {
    model: ImmutablePropTypes.map,
    models: ImmutablePropTypes.map,
    modelKey: PropTypes.string,
    closetAnchorDistances: ImmutablePropTypes.list,
}

function mapStateToProps(state, props) {
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
    const document = state.getIn(['documents', 'entries', documentKey])
    const postUrl = document && document.get('postUrl')
    const documentTitle = document && document.get('title')
    const lightboxVisibility = state.getIn(['settings', settingsActions.SET_LIGHTBOX_VISIBILITY])

    return {
        models,
        model,
        modelKey,
        documentTitle,
        closestAnchorDistances,
        lightboxVisibility,
        postUrl
    }
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the site actions so that the child components can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(siteActions)
)(Showcase)