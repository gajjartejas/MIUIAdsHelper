import {UPDATE_PURCHASE} from './actionTypes';

const updatePurchase = (purchased) => {
  return {
    type: UPDATE_PURCHASE,
    purchased: purchased,
  };
};

export {updatePurchase};
