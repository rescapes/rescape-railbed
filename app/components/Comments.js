/**
 * Created by Andy Likuski on 2016.09.14
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes'
import ReactDisqusThread from 'react-disqus-thread';
import {normalizeKeyToFilename} from "../utils/fileHelpers";
import close_svg from '../images/close.svg'
import comment_svg from '../images/comment.svg'
import * as documentActions from '../actions/document'
import * as modelActions from '../actions/model'

class Comments extends Component {
    constructor () {
        super()
        this.state = {
            commentObject: null,
            commentObjectKey: null,
            toggle: null
        }
    }

    componentWillMount() {
        // We are either showing coments for the document or a specific model
        const commentObject = this.props.modelKey ? this.props.model : this.props.document
        this.setState({
            commentObject: commentObject,
            commentObjectKey: this.props.modelKey || this.props.documentKey,
            toggle: this.props.modelKey ? this.props.toggleModelComments : this.props.toggleDocumentComments
        })
    }

    componentDidMount() {
        this.mirrorProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.state.commentKey)
            return;
        if (this.formArticleKey(nextProps) != this.formArticleKey() ||
                nextProps.commentsAreShowing != this.props.commentsAreShowing)
            this.mirrorProps(nextProps);
    }

    mirrorProps(props) {
        if (this.refs.counter) {
            this.refs.counter.setAttribute('data-disqus-identifier', this.formArticleKey(props));
            DISQUSWIDGETS.getCount({reset: true});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.formArticleKey(nextProps) != this.formArticleKey() ||
                nextProps.commentsAreShowing != this.props.commentsAreShowing

    }

    /***
     * Show the comments when the user clicks the comment count button
     */
    onClickCommentButton() {
        this.state.toggle(this.state.commentObjectKey, true)
    }

    /***
     * Hide the comments when the user clicks the close button
     */
    onClickCloseButton() {
        this.state.toggle(this.state.commentObjectKey, true)
        this.enableMainBodyScroll()
    }

    /***
     * Don't let the main body scroll when we are over the iframe. This seems to be a bug in at least
     * Chrome that when we run out of scroll on the iframe it bubbles the event to the main window
     */
    disableMainBodyScroll()
    {
        const document = window.document
        const html = document.documentElement
        const body = document.body
        var scrollTop = body.scrollTop
        html.classList.add('noscroll')
        html.style.top = -scrollTop;
    }

    enableMainBodyScroll()
    {
        const html = document.documentElement
        const body = document.body
        var scrollTop = parseInt(html.style.top)
        html.classList.remove('noscroll');
        body.scrollTop = -scrollTop;
    }

    /***
     * Render the comment counter button for the current document or model or render the comments if the button is
     * clicked
     * @returns {XML}
     */
    render() {
        const articleKey = this.formArticleKey()
        // Once we load the comments once keep the Disqus iframe around but undisplayed when not in use
        const commentsHaveShown = this.state.commentObject.get('commentsHaveShown')
        // TODO this isn't actually preventing the comments from reloading
        const commentsAreShowing = this.state.commentObject.get('commentsAreShowing')

        const disqus = commentsHaveShown || commentsAreShowing ?
            <div className="disqus-comment-thread-container"
                 style={{display: commentsAreShowing ? 'block' : 'none'}}
                 onMouseEnter={this.disableMainBodyScroll}
                 onMouseLeave={this.enableMainBodyScroll}
        >
            <img className='disqus-close-icon' src={close_svg} onClick={this.onClickCloseButton.bind(this)} />
            <div className="disqus-comment-thread-header" />
            <ReactDisqusThread
                className="disqus-comment-thread"
                shortname="rescapes"
                identifier={articleKey}
                title={this.props.modelKey ? `${this.props.documentTitle}: ${this.props.modelKey}` : this.props.documentTitle}
                url={`http://rescapes.net/${articleKey.replace('__','#')}`}
                onNewComment={this.handleNewComment}
            />
        </div> : <span/>

        /***
         * The comment button shows then number of comments for this model. Disqus injects the number into
         * div when we call mirrorProps
         * @type {XML}
         */
        const commentCountButton = <div
            className="comment-counter"
            style={{display: commentsAreShowing ? 'none' : 'block'}}
            onClick={this.onClickCommentButton.bind(this)} >
                <img className='comment-icon' src={comment_svg} />
                <div className="comment-count">
                    <div ref='counter' className="disqus-comment-count" />
                </div>
            </div>

        return <div className={`${this.props.className || 'comments'} ${commentsAreShowing ? 'showing' : ''}`}>
            {commentCountButton}
            {disqus}
        </div>
    }

    /***
     * Uses the document key and optional model key to form the article key
     *
     * @param props: Optional props so we can use nextProps. Defaults to this.props
     * @returns {string}
     */
    formArticleKey(props) {
        const documentUrlKey = normalizeKeyToFilename((props || this.props).documentTitle)
        const modelKey = (props ||this.props).modelKey
        const modelUrlKey = modelKey && normalizeKeyToFilename(modelKey)
        return modelKey ? `${documentUrlKey}__${modelUrlKey}` : documentUrlKey
    }
}

Comments.propKeys = {
    className: PropTypes.string,
    document: ImmutablePropTypes.map,
    documentTitle: PropTypes.string,
    documentKey: PropTypes.string,
    modelKey: PropTypes.string,
    model: ImmutablePropTypes.map,
    commentsAreShowing: PropTypes.bool,
}

function mapStateToProps(state, props) {
    return state.toObject()
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the site actions so that the child components can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(documentActions, modelActions)
)(Comments)
