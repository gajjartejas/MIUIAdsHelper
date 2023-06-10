import { IThemeState } from 'app/models/reducers/theme';
import { IAppConfigState } from '../reducers/appConfig';

interface IState {
  themeReducer: IThemeState;
  appConfigReducer: IAppConfigState;
}

export default IState;
