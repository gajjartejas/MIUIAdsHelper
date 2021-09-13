import {UPDATE_PURCHASE} from '../actions/actionTypes';

const initialState = {
  purchased: false,
};

const updateUser = (state, action) => {
  return {...state, purchased: action.purchased};
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PURCHASE:
      return updateUser(state, action);
    default:
      return state;
  }
};

export default userReducer;
