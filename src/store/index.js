import reducers from '../reducers/index';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

const applyStoreMiddleware = applyMiddleware(thunk)(createStore);
export const store = applyStoreMiddleware(reducers);
