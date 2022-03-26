import { IThemeState } from 'app/models/reducers/theme';
import { IAppConfigState } from '../reducers/appConfig';

export default interface IState {
  themeReducer: IThemeState;
  appConfigReducer: IAppConfigState;
}
