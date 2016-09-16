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
import table_of_contents_svg from '../images/toc.svg'
import * as documentActions from '../actions/document'

class TableOfContents extends Component {

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.documentKey || !this.props.modelKey)
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
    onClickTableOfContentsButton() {
        this.props.toggleTableOfContents(this.props.modelKey, true)
    }

    /***
     * Hide the comments when the user clicks the close button
     */
    onClickCloseButton() {
        this.props.toggleTableOfContents(this.props.modelKey, false)
    }

    /***
     * Render the comment counter button for the current model or render the comments if the button is
     * clicked
     * @returns {XML}
     */
    render() {
        if (!this.props.documentTitle || !this.props.modelKey) {
            return <div/>
        }
        const tableOfContentsAreShowing = this.props.document.get('tableOfContentsAreShowing')
        const tableOfContents = tableOfContentsAreShowing ?
            <div className="table-of-contents"
                 style={{display: tableOfContentsAreShowing ? 'block' : 'none'}}
            >
            <img className='table-of-contents-close-icon' src={close_svg} onClick={this.onClickCloseButton.bind(this)} />
            </div> :
            <img className='table-of-contents-icon' src={table_of_contents_svg} onClick={this.onClickTableOfContentsButton.bind(this)} />

        return <div className={`table-of-contents ${tableOfContentsAreShowing ? 'showing' : ''}`}>
            {tableOfContents}
        </div>
    }

    /***
     * Uses the docuemnt key and model key to form the article key
     * @param props: Optional props so we can use nextProps. Defaults to this.props
     * @returns {string}
     */
    formArticleKey(props) {
        const documentUrlKey = normalizeKeyToFilename((props || this.props).documentTitle)
        const modelUrlKey = normalizeKeyToFilename((props ||this.props).modelKey)
        return `${documentUrlKey}__${modelUrlKey}`
    }
}

TableOfContents.propKeys = {
    documentTitle: PropTypes.string,
    documentKey: PropTypes.string,
    modelKey: PropTypes.string,
    model: ImmutablePropTypes.map,
    tableOfContentsAreShowing: PropTypes.bool,
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
    Object.assign(documentActions)
)(TableOfContents)
