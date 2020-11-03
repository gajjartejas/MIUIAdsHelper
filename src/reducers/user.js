import {UPDATE_USER, NOTIFICATION_UPDATE, UPDATE_LANGUAGE, UPDATE_CART_TEIMS} from '../actions/actionTypes';

import Utils from '../utils/index';
import Config from '../config/index';
import Modules from '../module/index';

const initialState = {
  userdata: {},
};

const updateUser = (state, action) => {
  let ud = action.userdata;

  return {...state, userdata: Object.assign({}, ud), loginStatus: ud ? 1 : 0};
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return updateUser(state, action);
    default:
      return state;
  }
};

export default userReducer;
