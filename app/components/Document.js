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

/***
 * Document is the component container responsible for loading
 * and displaying a documents from an external source (e.g. Google Docs)
 */

import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { renderToStaticMarkup } from 'react-dom/server'
import moment from 'moment';
import {connect} from 'react-redux';
import {Map, OrderedMap, List} from 'immutable'
import * as actions from '../actions/document'
import * as siteActions from '../actions/site'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Scroll from 'react-scroll';
import {getAnchorToModels, getSceneAnchors} from '../utils/documentHelpers'
const scroll = Scroll.animateScroll;
import bookmark_png from '../images_dist/bookmark-320.png'

class Document extends Component {


    /***
     * When the Document content is loaded we want to index all of the anhors in the document text
     */

    componentDidMount() {
        this.handleScrollBound = this.handleScroll.bind(this)
        const document = ReactDOM.findDOMNode(this.documentDiv)
        document.addEventListener('scroll', this.handleScrollBound);
        document.addEventListener('scroll', function(e) {
            console.log(document.scrollTop)
        })

        if (this.props.scrollPosition)
            this.scrollTo(this.props.scrollPosition || 0)
        else
            this.handleScroll()

        function fixSafariScrolling(event) {
            event.target.style.overflowY = 'hidden';
            setTimeout(function () { event.target.style.overflowY = 'auto'; });
        }

        this.documentDiv.addEventListener('webkitAnimationEnd', fixSafariScrolling);
    }

    componentWillUnmount() {
        const document = ReactDOM.findDOMNode(this.documentDiv)
        document.removeEventListener('scroll', this.handleScrollBound);
        this.handleScrollBound = null;
    }

    /***
     * Likewise when the Document content updates we want to index anchors if we haven't done so.
     * I'm not sure if this is needed if componentDidMount fires at the right time, unless we
     */
    componentDidUpdate() {
        this.indexAnchors()
        if (this.props.sceneAnchors) {
            // Once we have registered anchors add scene circles to the Document div
            this.injectSceneCircles(this.documentDiv, this.props.sceneAnchors)
        }
    }

    /***
     * Get the Model3d anchor elements. The models have an anchorId that corresponds to one of the anchor ids
     * in the document HTML. Related models share the same anchor. We create pseudo-anchors for each scene
     * of the models, giving the pseudo-anchors an offset that evenly spaces them. If models share the same anchor,
     * we spread the pseudo-anchors for all the scenes of the shared models evenly.
     *
     * When all anchors are processed an action is sent to store the anchors in the state.
     */
    indexAnchors() {

        const domElement = ReactDOM.findDOMNode(this)
        const models = this.props.models
        const anchors = List([...domElement.querySelectorAll('a[id]')])
        // If no models or anchors yet or our anchors are already named return
        if (!models || !anchors.count() || !this.state || this.state.scrollHeight == domElement.scrollHeight)
            return
        this.setState({scrollHeight: domElement.scrollHeight})


        // Map anchors to models. One anchor can represent to one or more models
        // As a side-effect we give the anchor the generic model name the first time we encounter a new anchor
        const anchorToModels = getAnchorToModels(anchors, models)
        // Create pseudo anchors for each scenes. These are used to change the scene of the current
        // model as the user scrolls
        const sceneAnchors = getSceneAnchors(anchorToModels, domElement.scrollHeight)

        // Once we have the anchors loaded, put them into the document's state
        this.props.registerAnchors(anchorToModels, sceneAnchors)

        // Immediately register the scroll position so that the closest 3d model to the current text loads.
        // If we don't do this no model will load until the user scrolls
        this.handleScroll()
    }



    /***
     * Whenever the scrollTop changes send an action so we can recalculate the closest anchor tag to the scroll
     * position. A timer is used to prevent too many events from passing through
     * @param event: The scroll event. If undefined we get the scrollTop from the body element (which we
     * could do in any case)
     */
    handleScroll(event) {

        const scrollTop = this.documentDiv && this.documentDiv.scrollTop
        if (!scrollTop && scrollTop != 0)
            return
        const interval = 300
        const now = new Date()
        if (now - (this.state && this.state.lastScrollTime || 0) > interval) {
            // Tell the reducers the scroll position so that they can determine what model and scene
            // are current
            this.props.registerScrollPosition(scrollTop)
            this.setState({lastScrollTime: now })
        }
    }

    /***
     * Scroll immediately or smoothly
     * http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation
     * @param to: To this position
     * @param duration: if null immediately, otherwise in this duration
     */
    scrollTo(to, duration) {
        this.props.documentIsScrolling(true)
        duration = duration || 0
        const element = this.documentDiv,
            start = element.scrollTop,
            change = to - start,
            increment = 20;

        var animateScroll = function(elapsedTime) {
            elapsedTime += increment;
            if (duration==0) {
                // Indicate we are no longer scrolling so the scrollTop set is noticed
                this.props.documentIsScrolling(false)
                element.scrollTop = to
                return
            }
            var position = this.easeInOut(elapsedTime, start, change, duration);
            if (elapsedTime >= duration) {
                // Indicate we are no longer scrolling so the scrollTop set is noticed
                this.props.documentIsScrolling(false)
            }
            element.scrollTop = position;
            const self = this
            if (elapsedTime < duration) {
                setTimeout(function() {
                    animateScroll.apply(self, [elapsedTime]);
                }, increment);
            }
        };

        animateScroll.apply(this, [0]);
    }

    easeInOut(currentTime, start, change, duration) {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }

    /***
     * Check for a prop change to anchors, and inform the Document if any values changed
     * @param nextProps
     */
    componentWillReceiveProps(nextProps){

        const closestAnchors = nextProps.document.get('closestAnchors')
        const previousClosestAnchors = this.props.document && this.props.document.get('closestAnchors')
        // If the anchors changed that means the document is newly loaded
        if ((!previousClosestAnchors && closestAnchors) || (previousClosestAnchors && !previousClosestAnchors.equals(closestAnchors))) {
            // Have the Model3ds react to the new closest anchors
            this.props.documentTellModelAnchorsChanged(closestAnchors)

        }
        // If a hash is in the Router location scroll to it if we aren't already there
        // This is only needed on initial load when the document isn't ready yet
        if (nextProps.anchorToModels != this.props.anchorToModels || (nextProps.location && this.props.location && nextProps.location.hash != this.props.location.hash)) {
            // If we have a Router location hash, scroll to it now
            // The Router can't do this for us because the Document isn't loaded
            const hash = nextProps.location.hash
            if (hash) {
                const anchor = nextProps.anchorToModels.keySeq().find(
                    anchor => anchor.get('name') == hash.replace('#','')
                )
                // Update the Document scroll state to the first model of the matching anchor
                this.props.scrollToModel(anchor.get('name'))
            }
        }
        // If the desired document scrollPosition has been changed by clicking a table of contents button or similar
        else if (
            nextProps.document.get('scrollPosition') != this.props.scrollPosition &&
            nextProps.document.get('scrollPosition') != this.documentDiv.scrollTop) {
            // Scroll in 100 ms. This updates the this.documentDiv.scrollTop incrementally to the value
            this.scrollTo(nextProps.document.get('scrollPosition'), 100)
        }
    }

    /***
     * The Document needs to add the Date and author credit
     * @param date
     * @param renderToStaticMarkup
     */
    getExtraHeaderHtml() {
        const document = this.props.document
        const date = document.get('date')
        // Add in the document credit and date
        return renderToStaticMarkup(<div className="document-header">
            {document.get('author') ?
                <div className="document-credit">by <span className="author">{document.get('author')}</span></div> :
                <span/>}
            {document.get('date') ?
                <div className="document-date">
                    <span
                        className="date">{moment(document.get('date')).format('MMMM Do, YYYY')}
                    </span>
                </div> :
                <span/>}
            </div>
        )
    }

    /***
     * Render the document to the right of the model
     * @returns {XML}
     */
    render() {
        // Since the HTML comes from a Google doc or similar we can completely trust it
        const document = this.props.document
        if (!document)
            return <div ref={(c) => this.documentDiv = c} />
        const body = document.getIn(['content', 'body'])
        if (!body)
            return <div ref={(c) => this.documentDiv = c} />
        // The only processing we do to the Google doc HTML is the following:
        // 1) Replace pairs of <hr> elements with <div className='modelSection'>...</div>
        // This allows us to style each portion of the doc to match a corresponding 3D model
        const modifiedBody = this.injectStyledDivWrappers(body, this.getExtraHeaderHtml())

        return <div
            ref={(c) => this.documentDiv = c}
            className={`${this.props.className || 'document'} ${this.props.overlayDocumentIsShowing ? 'overlay-document-showing' : ''}`}
        >
            <div dangerouslySetInnerHTML={{__html: modifiedBody }}>
            </div>
        </div>
    }


    /***
     * Wraps each section of text in a <div class="modelSection">...</div> So the user can tell
     * which part of the text corresponds to which 3d model
     */
    injectStyledDivWrappers(body, extraHeaderHtml) {
        const regex = /<hr>/g,
            hrLength = '<hr>'.length,
            // The length of the spacer before and after each hr
            hrSpacerRegexStart = /^((?:<p class="c\d+?"><span class="c\d+?"><\/span><\/p>)+)/,
            hrSpacerRegexEnd = /((?:<p class="c\d+?"><span class="c\d+?"><\/span><\/p>)+)$/,
            contentsDiv = '<div id="contents">',
            contentsDivLength = contentsDiv.length,
            // For the top of the document
            // Grab everything starting with the "content" div and put the just header inside it
            contentDivIndex = body.indexOf(contentsDiv)


        var index = 0,
            modifiedBody = null,
            startLocation = null,
            // Look for <hr> tags separating the document. If there are none make a pseudo
            // one representing the whole document except for the div footer
            result = regex.exec(body) || {index: body.indexOf('<div id="footer">')}
        // For each <hr> or for the single pseudo one
        do {
            let bodyContent = null
            if (index == 0) {
                // <div id="content">
                modifiedBody = body.slice(contentDivIndex, contentDivIndex + contentsDivLength)
                // <div id="header>header</div>...spacer<hr> (not including spacer<hr>)
                bodyContent = body.slice(0, contentDivIndex) +
                    extraHeaderHtml +
                    body.slice(contentDivIndex + contentsDivLength, result.index)
            }
            else {
                // Grab everything since last <hr>spacer and before this spacer<hr>
                bodyContent = body.slice(startLocation, result.index)
            }
            // Concat the <div class='modelSection'>
            // ...content since last hr to this hr minus the spacer before hr ...
            // </div>
            // We remove the spacers in favor of padding/margin styling
            // We move the anchor to the top of the section and give it an image wrapper
            const startSpacerMatch = hrSpacerRegexStart.exec(bodyContent)
            const startSpacerIndex = startSpacerMatch ? startSpacerMatch[0].length : undefined
            const endSpacerMatch = hrSpacerRegexEnd.exec(bodyContent)
            const endSpacerIndex = endSpacerMatch ? endSpacerMatch.index : undefined
            const bodySlice = bodyContent.slice(startSpacerIndex, endSpacerIndex)
            const regex = /(<a.*?>)(<\/a>)/
            const match = regex.exec(bodySlice)
            modifiedBody = modifiedBody.concat(
                "<div class='model-section'>").concat(
                match ? `${match[1]}<img class="bookmark-icon" src=${bookmark_png} />${match[2]}` : '').concat(
                `${bodySlice.replace(regex, '')}</div>`)

            // Store the index after the <hr>
            startLocation = result.index + hrLength
            index++
        } while ( (result = regex.exec(body)) )
        return modifiedBody
    }
    /***
     * Inject scene circles into the document div
     * This happens post render once we have create the scene anchors
     * Create a marker for each scene other than the first scene of the model or model group
     * We don't mark the first scene because it's clearly marekd by the start of the model or model group
     * @param documentDiv
     * @param sceneAnchors
     */
    injectSceneCircles(documentDiv, sceneAnchors) {
        const oldList = documentDiv.getElementsByClassName("scene-circles")[0];
        if (oldList)
            documentDiv.removeChild(oldList)
        const list = document.createElement('div')
        list.className = "scene-circles";
        documentDiv.appendChild(list)

        sceneAnchors.forEach((sceneAnchor) => {
            if (sceneAnchor.index != 0) {
                var node = document.createElement("div");
                node.className = 'table-of-contents-node toc-scene'
                node.style.top = `${sceneAnchor.offsetTop}px`
                list.appendChild(node)
            }
        })
    }
}

Document.propTypes = {
    settings: ImmutablePropTypes.map,
    document: ImmutablePropTypes.map,
    documentKey: PropTypes.string,
    models: ImmutablePropTypes.map,
    scrollPosition: PropTypes.number,
    // Tell the document if an overlay document is covering it
    overlayDocumentIsShowing: PropTypes.bool,
    // These are listed for ride in OverlayDocument
    className: PropTypes.string,
    // Once the Document is loaded we'll have a mapping of it's anchors to its Model3ds
    anchorToModels: ImmutablePropTypes.map,
    // Once the Document is loaded we'll have sceneAnchors representing the document position
    // of each scene
    sceneAnchors: PropTypes.array,
    // The router's location so we can scroll to the correct bookmark.
    // The router doesn't do this for us because we set the name of the bookmarks when the Document loads
    location:PropTypes.object
}

/***
 * Map the state, which is our list of documents, to the current document
 * We also pass the model states of the models that belong to the current document,
 * so that we can initially update anchor tags in the document body to be named based on the model/scene keys
 * @param state
 * @returns {{documents: *}}
 */
function mapStateToProps(state) {
    const settings = state.get('settings')
    const documentKey = state.getIn(['documents', 'current'])
    const document = state.getIn(['documents', 'entries', documentKey])
    const scrollPosition = document && document.get('scrollPosition')
    const modelKeysInDocument = document && document.get('modelKeys')
    const anchorToModels = document.get('anchorToModels')
    const sceneAnchors = document.get('sceneAnchors')
    const location = state.getIn(['documents', 'location'])
    return {
        settings,
        document: document,
        documentKey,
        models: modelKeysInDocument &&
            state.getIn(['models', 'entries']).filter((value,key) => modelKeysInDocument.includes(key)),
        scrollPosition,
        anchorToModels,
        sceneAnchors,
        location
    }
}

class RawDocument extends Document {}
export {RawDocument}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the actions so that the component can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(actions, siteActions)
)(Document)