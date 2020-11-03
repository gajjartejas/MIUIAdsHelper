import {UPDATE_USER} from './actionTypes';

const updateuser = (userdata) => {
  return {
    type: UPDATE_USER,
    userdata: userdata,
  };
};

export {updateuser};
