import _ from 'lodash';

export default function TrackReducer(state = {}, action) {
  switch (action.type) {
    case 'LOAD_TRACK_FULFILLED': {
      const satellite = action.payload.satellite;
      const newState = _.clone(state);
      if (state[satellite] && state[satellite].length) {
        const track = state[satellite]
        .concat(action.payload.data)
        .slice(action.payload.data.length);
        newState[satellite] = track;
        return newState;
      }
      newState[satellite] = action.payload.data;
      return newState;
    }
    default:
      return state;
  }
}
