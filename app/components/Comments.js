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

export default class Comments extends Component {
    handleNewComment(comment) {
        console.log(comment.text);
    }

    componentDidMount() {
        this.mirrorProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.formArticleKey(nextProps) != this.formArticleKey())
            this.mirrorProps(nextProps);
    }

    mirrorProps(props) {
        if (this.ref.counter)
            this.ref.counter.setAttribute('data-disqus-identifier', this.formArticleKey(props));
    }

    render() {
        const articleKey = this.formArticleKey()
        const comments = !this.props.commentsShowing ?
            <div ref='counter' className="disqus-comment-count">First article</div> :
            <ReactDisqusThread
                className="disqus-comments-thread"
                shortname="rescapes"
                identifier={`/${articleKey}`}
                title={`${this.props.documentTitle}: ${this.props.modelKey}`}
                url={`http://rescapes.net/${articleKey}`}
                onNewComment={this.handleNewComment}
            />
        return <div className="comments">
            {comments}
        </div>
    }

    /***
     * Uses the docuemnt key and model key to form the article key
     * @param props: Optional props so we can use nextProps. Defaults to this.props
     * @returns {string}
     */
    formArticleKey(props) {
        const documentUrlKey = normalizeKeyToFilename((props || this.props).documentKey)
        const modelUrlKey = normalizeKeyToFilename((props ||this.props).modelKey)
        return `/${documentUrlKey}/${modelUrlKey}`
    }
}

Comments.propKeys = {
    documentTitle: PropTypes.string,
    documentKey: PropTypes.string,
    modelKey: PropTypes.string,
    commentsShowing: PropTypes.bool,
}
