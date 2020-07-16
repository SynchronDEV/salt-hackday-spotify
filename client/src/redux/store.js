import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import * as reducers from './reducers/'

export const store = createStore(combineReducers(reducers), compose(applyMiddleware(thunk), composeWithDevTools(), ));