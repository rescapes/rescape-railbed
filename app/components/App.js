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
 * The App container. It is responsible for rendering the matching route
 */
// Do this once before any other code in your app (http://redux.js.org/docs/advanced/AsyncActions.html)
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import * as actions from '../actions/document';
import {connect} from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

// The children are the components of the chosen route
class App extends Component {

  componentDidMount() {
    this.props.setDocumentLocation(this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    // Set the current document
    if (this.props.documentKey != nextProps.documentKey)
      this.props.showDocument(nextProps.documentKey);

    // If the location hash came in the URL set that
    if (this.props.location.hash != nextProps.location.hash) {
      this.props.setDocumentLocation(nextProps.location);
    }
  }

  render() {
    return React.cloneElement(this.props.children, {});
  }
};

App.PropTypes = {
  documentKey: PropTypes.string,
  overlayDocumentKey: PropTypes.string,
  document: ImmutablePropTypes.map,
  location: PropTypes.object,
  orientation: PropTypes.bool
};

function mapStateToProps(state, props) {

  // The key of the document if one was specified in the URL

  const splat = props.location.splat;
  const documents = state.getIn(['documents', 'entries']);
  const overlayDocumentKey = state.getIn(['documents', 'currentOverlay']);

  let document = null;
  if (splat && documents.get(splat)) {
    document = documents.get(splat);
  } else {
    // Load and show the newest post that isn't marked in the future
    // TODO this will need to be used by a post listing
    const sortedDocuments = state.getIn(['documents', 'entries']).sort(
      (a, b) => a.get('date') > b.get('date'));
    const now = new Date();
    // Get the newest document. Ignore documents like About and Contact that have no date
    document = sortedDocuments.reverse().find(document => document.get('date') && document.get('date') <= now);
  }
  // Add the window.orientation so we can detect orientation in iOS devices
  return Object.assign(state.toObject(), {
    documentKey: documents.keyOf(document),
    document: document,
    overlayDocumentKey,
    orientation: window.orientation
  });

}

export default connect(
  mapStateToProps,
  actions
)(App);
