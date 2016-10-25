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
import {connect} from 'react-redux'
import ImmutablePropTypes from 'react-immutable-proptypes'
import * as actions from '../actions/model'
import * as siteActions from '../actions/site'
import * as settingsActions from '../actions/settings'
import { ShareButtons, generateShareIcon } from 'react-share'
import {currentSceneKeyOfModel, checkIf3dSet} from '../utils/modelHelpers'
import {getModelTops, calculateModelFadeAndToward} from '../utils/modelHelpers'
import {Map} from 'immutable'
import Model3dTitle from './Model3dTitle'
import close_svg from '../images/close.svg'

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

    /***
     * Enable or disable 3d for the current model. Enabled means that Sketchup loads. Disabled means a video loads
     * Returns a bound function with forced closed
     */
    bindToggle3d(force) {
        return function() {
            this.props.toggleModel3d(this.props.modelKey, force)
        }.bind(this)
    }

    render() {
        if (!this.props.models || !this.props.modelKey || !this.props.document || !this.props.postUrl)
            return <div className='showcase'/>

        const modelKey = this.props.modelKey
        const model = this.props.model
        const documentTitle = this.props.documentTitle
        const media = this.props.model && this.props.model.get('media')
        // Both model and media need to know the calculated model tops.
        // If the next or previous model is at all visible, we don't want to show the media
        const modelTops = getModelTops(this.props.document, this.props.models, this.props.settings)
        const [fade, toward] = calculateModelFadeAndToward(modelTops)
        const shareTitle = `${documentTitle} (${modelKey})`
        let model3dTitle = null

        if (!this.props.overlayDocumentIsShowing && this.props.models && this.props.modelKey && this.props.document) {
            const modelTops = getModelTops(this.props.document, this.props.models, this.props.settings)
            const [fade, toward] = calculateModelFadeAndToward(modelTops)
            model3dTitle = <Model3dTitle
                model={this.props.model}
                modelKey={this.props.modelKey}
                lightboxVisibility={this.props.lightboxVisibility}
                sceneKey={this.props.sceneKey}
                fade={fade}
                toward={toward}
            />
        }
        else {
            model3dTitle = <span/>
        }

        const is3dSet = checkIf3dSet(this.props.model, this.props.defaultIs3dSet)
        const toggle3d = !is3dSet ?
            <span className='toggle-3d-is-off' onClick={this.bindToggle3d(!is3dSet)}>explore 3D model</span> :
            <span className='toggle-3d-is-on'>
                <span>exit 3D model</span>
                <img className='toggle-3d-is-on-icon' src={close_svg} onClick={this.bindToggle3d(!is3dSet)} />
            </span>
        const modelCredits = <span className='model-credits'>
            <a target="credits" href={this.props.model.get('modelCreditUrl')}>model credits</a>
        </span>

        return <div className='showcase'>
            { model3dTitle }
            <span className='showcase-links'>
                { modelCredits }
                { toggle3d }
            </span>
            <Model model={model} modelKey={this.props.modelKey} modelTops={modelTops} toward={toward} />
            <Media media={media} modelKey={this.props.modelKey} fade={fade} toward={toward}/>
            <div className={`share-icons ${fade} ${toward}`}>
                {SHARE_BUTTONS.map(function(shareButton, i) {
                    // TODO need a media URL for pinterest. Need scene-specific urls
                    return React.createElement(
                        shareButton,
                        Object.assign({key:i, title: shareTitle, url: this.props.postUrl},
                         shareButton == PinterestShareButton ? {media:
                         `http://img.youtube.com/vi/${this.props.model.get('videoId')}/0.jpg`} : {}
                        ),
                        // size: null keeps the icons from setting there style width/height
                        // so that we can do it with css
                        React.createElement(SHARE_ICONS[i], {key:i, size:null, round:true })
                    )
                }, this)}
            </div>
        </div>
    }
}

Showcase.propTypes = {
    defaultIs3dSet: PropTypes.bool,
    model: ImmutablePropTypes.map,
    models: ImmutablePropTypes.map,
    modelKey: PropTypes.string,
    sceneKey: PropTypes.string,
    sceneIndex: PropTypes.number,
    documentTitle: PropTypes.string,
    postUrl: PropTypes.string
}

function mapStateToProps(state, props) {
    const settings = state.get('settings')
    const documentKey = state.getIn(['documents', 'current'])
    // We use this to find out if its time to transition the current model to the next or previous
    // By transition we mean vertical move the current model up or down in the div and start showing
    // the next or previous
    const scrollPosition = state.getIn(['documents', 'entries', documentKey, 'scrollPosition'])
    const models = documentKey ? state.get('models') : Map()

    const modelKey = models && models.get('current')
    const model = modelKey && models.getIn(['entries', modelKey])
    const document = state.getIn(['documents', 'entries', documentKey])
    const postUrl = document && document.get('postUrl')
    const documentTitle = document && document.get('title')
    const sceneKey = currentSceneKeyOfModel(model)
    // Used to set a css class so we can smoothly transition scene titles
    const sceneIndex = model && model.getIn(['scenes', 'entries']).keySeq().indexOf(sceneKey)
    const commentsAreShowing = model && model.get('commentsAreShowing')
    const defaultIs3dSet = state.getIn(['settings', settingsActions.SET_3D])

    return {
        settings,
        document,
        documentKey,
        models,
        model,
        modelKey,
        sceneKey,
        sceneIndex,
        documentTitle,
        postUrl,
        commentsAreShowing,
        defaultIs3dSet
    }
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the site actions so that the child components can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(actions, siteActions)
)(Showcase)