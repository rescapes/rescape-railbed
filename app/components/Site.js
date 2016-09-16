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
import Footer from './Footer'
import Showcase from './Showcase'
import Document from './Document'
import {connect} from 'react-redux';
import React, {Component, PropTypes} from 'react'
import DocumentMeta from 'react-document-meta';
import ImmutablePropTypes from 'react-immutable-proptypes'
var himalaya = require('himalaya');
import Comments from './Comments'

export class Site extends Component {

    /***
     * This seems like the place to bind methods (?)
     * @param props
     */
    constructor(props) {
        super(props)
    }

    /***
     * Fetches the documents by url
     */
    componentDidMount() {
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
            meta = document && document.get('content') && head.reduce(function (o, v) {
                    // sometimes garbage is parsed, so check for the tagName property
                    if (v['tagName']) {
                        // Set the tagName value key to the attributes
                        o[v['tagName']] = v['attributes'];
                        // Use _text to indicate text node content, if any
                        o[v['tagName']]._text = v.content
                        // A title tag has the text in the children
                        if (v['tagName'] == 'title')
                            o[v['tagName']] = v.children && v.children[0].content
                    }
                    return o
                }, {});
        }
        if (!this.props.documentKey)
            return <div className="site"/>

        const comments =  this.props.modelKey ?
            <Comments className='comments'
                documentKey={this.props.documentKey}
                documentTitle={this.props.documentTitle}
                model={this.props.model}
                modelKey={this.props.modelKey}
                commentsAreShowing={this.props.commentsAreShowing}
            /> : <div/>
        // TODO I feel like I should pass props to Showcase and Document, but they have access
        // to the state and use mapStateToProps, so why bother?
        // DocumentMeta merges the head tag data in from the document's head tag data
        // Header of the overall web page
        // Displays the current 3D model and accompanying media
        // Displays the document, which is loaded from Google Docs or similar
        // Footer of the overall web page
        return <div className='site'>
            <DocumentMeta {...meta} extend />
            {comments}
            <Header />
            <Showcase />
            <Document />
            <Footer />
        </div>;
    }
};

Site.propTypes = {
    documents: ImmutablePropTypes.map,
    documentKey: PropTypes.string,
    document: ImmutablePropTypes.map,
    models: ImmutablePropTypes.map,
    modelKey: PropTypes.string,
    model: ImmutablePropTypes.map,
    docuemntTitle: PropTypes.string,
    commentsAreShowing: PropTypes.bool
}

/***
 * Maps the entire state to the site so that it can distribute it to its child components
 * @param state
 * @returns {Map<K, V>|*|Map<string, V>}
 */
function mapStateToProps(state) {

    const documents = state.get('documents')
    const documentKey = documents.get('current')
    const document = documents.getIn(['entries', documentKey])

    const models = documentKey ? state.get('models') :new Map()
    const modelKey = models && models.get('current')
    const model = modelKey && models.getIn(['entries', modelKey])


    const documentTitle = document && document.get('title')
    const commentsAreShowing = model && model.get('commentsAreShowing')

    return {
        document,
        documents,
        documentKey,
        model,
        modelKey,
        documentTitle,
        commentsAreShowing
    }
}

export default connect(mapStateToProps)(Site)
