/**
 * Created by Andy Likuski on 2016.10.28
 * Copyright (c) 2016 Andy Likuski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
import PropTypes from 'prop-types';
import React, { Component} from 'react'
import CommentsButton from './CommentsButton'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {normalizeModelName} from '../utils/modelHelpers'
import {List} from 'immutable'

export default class ModelCommentsButtons extends React.Component {

    render() {
        const commentsButtons = (this.props.anchorToModels ? this.props.anchorToModels.entrySeq() : List()).map(function([anchor, models]) {
            const modelEntry = models.entrySeq().get(0)
            const [key, model] = modelEntry
            const modelTitle = normalizeModelName(key, model)
            return !model.get('noComments') ?
                <CommentsButton
                    style={{top:`${anchor.get('offsetTop')}px`}}
                    key={modelTitle}
                    modelTitle={modelTitle}
                    documentTitle={this.props.documentTitle}
                    documentKey={this.props.documentKey}
                    document={this.props.document}
                    commentsAreShowing={this.props.modelCommentsAreShowing}
                /> :
                <span key={modelTitle}/>
        }, this).toArray()

        return <div className="model-comments-counters">
            {commentsButtons}
        </div>
    }
}
ModelCommentsButtons.propKeys = {
    documents: ImmutablePropTypes.map,
    documentTitle: PropTypes.string,
    documentKey: PropTypes.string,
    anchorToModels: ImmutablePropTypes.map,
    documentCommentsAreShowing: PropTypes.bool,
    modelCommentsAreShowing: PropTypes.bool
}