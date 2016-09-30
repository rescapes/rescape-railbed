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
import {normalizeKeyToFilename} from "../utils/fileHelpers";
import comment_svg from '../images/comment.svg'
import * as documentActions from '../actions/document'
import * as modelActions from '../actions/model'
import statuses from '../statuses'
import {isSeeking} from '../utils/documentHelpers'

class Comments extends Component {
    constructor () {
        super()
        this.state = {
            toggle: null
        }
    }

    /**
     * The current model key or document key
     * @returns {*}
     */
    commentObjectKey() {
        return this.props.modelKey ? this.props.modelKey : this.props.documentKey
    }

    componentWillMount() {
        this.setState({
            toggle: this.props.modelKey ? this.props.toggleModelComments : this.props.toggleDocumentComments
        })
    }

    componentDidMount() {
        this.mirrorProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.commentObjectKey())
            return;
        if (!this.props.isSeeking && (
            this.formArticleKey(nextProps) != this.formArticleKey() ||
            nextProps.commentsAreShowing != this.props.commentsAreShowing
        ))
            this.mirrorProps(nextProps);
    }

    mirrorProps(props) {
        if (this.refs.counter) {
            this.refs.counter.setAttribute('data-disqus-identifier', this.formArticleKey(props));
            if (window.DISQUSWIDGETS)
                window.DISQUSWIDGETS.getCount({reset: true});
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
        // Close the model or document comments if open
        this.state.toggle(this.commentObjectKey(), true)
    }

    /***
     * Render the comment counter button for the current document or model if comments are not expanded
     * The comment button shows the number of comments for this model.
     * Disqus injects the number into div when we call mirrorProps
     * @type {XML}
     * @returns {XML}
     */
    render() {
        if (!this.props.document)
            return <div/>
        return <div className={this.props.className} >
            <div
                className={`comment-counter
                    ${this.props.modelKey ? 'comment-counter-model' : 'comment-counter-document'}
                    ${this.props.documentStatus != statuses.READY ? 'loading' : ''} `}
                style={{display: this.props.commentsAreShowing ? 'none' : 'block'}}
                onClick={this.onClickCommentButton.bind(this)} >
                <img className='comment-icon' src={comment_svg} />
                <div className='comment-count'>
                    <div ref='counter' className="disqus-comment-count" />
                </div>
            </div>
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
    documentStatus: PropTypes.bool,
    // Don't load the comment count if we are seeking
    isSeeking: PropTypes.bool
}

function mapStateToProps(state, props) {
    const documents = state.get('documents')
    const documentKey = documents.get('current')
    const document = documents.getIn(['entries', documentKey])
    return Object.assign(
        state.toObject(), {
            documentStatus: document && document.get('status'),
            isSeeking: isSeeking(document)
        })
}

/***
 * Connect the mapStateToProps to provide the props to the component.
 * Connect the site actions so that the child components can send the actions based on events.
 */
export default connect(
    mapStateToProps,
    Object.assign(documentActions, modelActions)
)(Comments)
