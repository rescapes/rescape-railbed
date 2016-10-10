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

// Do this once before any other code in your app (http://redux.js.org/docs/advanced/AsyncActions.html)
import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom';
import {Router, Route, useRouterHistory} from 'react-router';
import App from './components/App'
import Site from './components/Site'
import makeStore from './store'
import {Provider} from 'react-redux';
import {showDocument} from './actions/document'
import {setState} from './actions/site'
import initialState from './initialState'
import { createHistory } from 'history'
// useRouterHistory creates a composable higher-order function
const appHistory = useRouterHistory(createHistory)({ queryKey: false })

const store = makeStore()
window.store = store;

// Initialize Firebase
// TODO: Replace with your project's customized code snippet

/*
import firebase from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyB4Kz8zXJaqOTOzEu5ZvwEKiOfu_ZVUK-o",
    authDomain: "rescape-railbed.firebaseapp.com",
    databaseURL: "https://rescape-railbed.firebaseio.com",
    storageBucket: "rescape-railbed.appspot.com",
    messagingSenderId: "895444132656"
};
firebase.initializeApp(firebaseConfig);
*/


/***
 * App is the common component for all of our routes
 */
const routes = <Route component={App}>
    <Route path="/" component={Site} />
</Route>;

ReactDOM.render(
    <Provider store={store}>
        <Router history={appHistory}>{routes}</Router>
    </Provider>,
    document.getElementById('app')
);


store.dispatch(setState(initialState))

const state = store.getState()
// Load and show the newest post that isn't marked in the future
// TODO this will need to be used by a post listing
const sortedDocuments = state.getIn(['documents', 'entries']).sort(
    (a, b) => a.get('date') > b.get('date'))
// Pretend it's the distant future
const now = new Date();
// Get the newest document. Ignore documents like About and Contact that have no date
const currentDocument = sortedDocuments.reverse().find(document => document.get('date') && document.get('date') <= now)
store.dispatch(showDocument(sortedDocuments.keyOf(currentDocument)))
