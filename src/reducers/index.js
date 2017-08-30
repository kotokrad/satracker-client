import { combineReducers } from 'redux';

import TrackReducer from './TrackReducer';

export default combineReducers({
  track: TrackReducer,
});
