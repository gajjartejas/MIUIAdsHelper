/*
 * combines all th existing reducers
 */
import * as themeReducer from './themeReducer';
import * as appConfigReducer from './appConfigReducer';
export default Object.assign(themeReducer, appConfigReducer);
