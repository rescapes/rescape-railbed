/**
 * Created by Andy Likuski on 2016.05.26
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/***
 * Site is the top-level container component for displaying a document and its models and media
 * An site consists of documents from a source (e.g. Google Docs), the
 * schowcase for multimedia that accompanies the documents (3D models, images, etc),
 * and a header and footer
 */

import Header from './Header'
import Showcase from './Showcase'
import Document from './Document'
import {connect} from 'react-redux';
import React, {Component, PropTypes} from 'react'
import DocumentMeta from 'react-document-meta';
import ImmutablePropTypes from 'react-immutable-proptypes'
import Comments from './Comments'
import TableOfContents from './TableOfContents'
import OverlayDocument from './OverlayDocument'
import close_svg from '../images/close.svg'
import * as documentActions from '../actions/document'
import himalaya from 'himalaya'

export class Site extends Component {


    /***
     * Close the Overlay Document when the close button is clicked
     * This is here rather than in OverlayDocument so that it shows over the Header
     */
    onClickCloseButton() {
        // Clear the hash from the URL if it exists
        this.props.history.push('/');
        this.props.closeOverlayDocument()
    }

    render() {
        // Convert the <head> tag elements from the document into JSON so that we can merge them into
        // our existing <head> tags
        const currentDocumentKey = this.props.documents.get('current');
        const document = currentDocumentKey && this.props.documents.getIn(['entries', currentDocumentKey]);
        var meta = {}
        if (document) {
            const head = himalaya.parse(document.getIn(['content', 'head']))
            // In addition to the document's <head> tags add in a title since the document meta data doesn't include it
            // ignore shortcut icons
            meta = document && document.get('content') && head.reduce(function (o, v) {
                    // sometimes garbage is parsed, so check for the tagName property
                    if (v['tagName'] && v['attributes'].rel!='shortcut icon') {
                        // Set the tagName value key to the attributes
                        o[v['tagName']] = v['attributes'];
                        // Use _text to indicate text node content, if any
                        o[v['tagName']]._text = v.content
                        // A title tag has the text in the children
                        // Show Rescape here. We could show the Document title
                        if (v['tagName'] == 'title')
                            o[v['tagName']] = 'Rescape' // v.children && v.children[0].content
                    }
                    return o
                }, {});
        }
        if (!this.props.documentKey)
            return <div className="site"/>

        // This is our layout if an overlay document is showing (About, Contact, etc)
        if (this.props.overlayDocumentIsShowing) {
            return <div className='site'>
                <DocumentMeta {...meta} extend />
                <Header />
                <Showcase />
                <div>
                    <img className='overlay-document-close-icon' src={close_svg} onClick={this.onClickCloseButton.bind(this)} />,
                    <div className='showcase-screen' />
                    <OverlayDocument />
                </div>
            </div>
        }

        // Shows the document or model comments if expanded
        const comments = <Comments className='comments'
            document={this.props.document}
            documentKey={this.props.documentKey}
            documentTitle={this.props.documentTitle}
            // null out the model key if the documentCommentsAreShowing so we have the document context
            model={this.props.documentCommentsAreShowing ? null : this.props.model}
            modelKey={this.props.documentCommentsAreShowing ? null : this.props.modelKey}
            commentsAreShowing={this.props.documentCommentsAreShowing || this.props.modelCommentsAreShowing}
        />

        // Our top and bottom table of contents
        const tableOfContents = this.makeTableOfContents(true)

        // DocumentMeta merges the head tag data in from the document's head tag data
        // Header of the overall web page
        // Displays the current 3D model and accompanying media
        // Displays the document, which is loaded from Google Docs or similar
        // Footer of the overall web page
        return <div className='site'>
            <DocumentMeta {...meta} extend />
            {comments}
            {tableOfContents}
            <Header />
            <Showcase />
            <Document/>
        </div>;
    }

    /***
     * Creates the table of contents for above or below the document
     * The table of contents above the document shows Model3ds that are behind the current scroll position
     * The table of contents below the document shows Model3ds that are ahead the current scroll position
     * @param isTop. True if this is the top table of contents, false for the bottom table of contents
     * @returns {XML}
     */
    makeTableOfContents(isTop) {
        return this.props.modelKey ?
            <TableOfContents isTop={isTop}
                             isExpanded={true}
                             documentKey={this.props.documentKey}
                             documentTitle={this.props.documentTitle}
                             document={this.props.document}
                             model={this.props.model}
                             modelKey={this.props.modelKey}
            /> : <div/>;
    }
};

Site.propTypes = {
    settings: ImmutablePropTypes.map,
    documents: ImmutablePropTypes.map,
    documentKey: PropTypes.string,
    document: ImmutablePropTypes.map,
    models: ImmutablePropTypes.map,
    modelKey: PropTypes.string,
    model: ImmutablePropTypes.map,
    documentTitle: PropTypes.string,
    documentCommentsAreShowing: PropTypes.bool,
    modelCommentsAreShowing: PropTypes.bool,
    overlayDocumentIsShowing: PropTypes.bool,
    sceneKey: PropTypes.string
}

/***
 * Maps the entire state to the site so that it can distribute it to its child components
 * @param state
 * @returns {Map<K, V>|*|Map<string, V>}
 */
function mapStateToProps(state) {

    const settings = state.get('settings')
    const documents = state.get('documents')
    const documentKey = documents.get('current')
    const document = documents.getIn(['entries', documentKey])

    const models = documentKey && state.get('models')
    const modelKey = models && models.get('current')
    const model = modelKey && models.getIn(['entries', modelKey])

    const documentTitle = document && document.get('title')
    const documentCommentsAreShowing = document && document.get('commentsAreShowing')
    const modelCommentsAreShowing = model && model.get('commentsAreShowing')
    // Announce if an overlay document is present (About, Contact, etc)
    const overlayDocumentIsShowing = !!(documents && documents.get('currentOverlay'))
    const sceneKey = models && models.getIn(['entries', modelKey, 'scenes', 'current'])

    return {
        settings,
        document,
        documents,
        documentKey,
        model,
        models,
        modelKey,
        documentTitle,
        documentCommentsAreShowing,
        modelCommentsAreShowing,
        overlayDocumentIsShowing,
        sceneKey
    }
}

export default connect(mapStateToProps, documentActions)(Site)
