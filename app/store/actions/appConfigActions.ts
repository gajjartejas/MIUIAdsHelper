/*
 * Reducer actions related with login
 */
import * as types from './types';

export function updatePurchase(purchased: boolean) {
  return {
    type: types.UPDATE_PURCHASE,
    payload: purchased,
  };
}
