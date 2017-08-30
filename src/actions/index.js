import { TRACK_ENDPOINT_URL } from '../config';

// eslint-disable-next-line import/prefer-default-export
export const loadTrack = (satellite, timestamp, points) => {
  let url = `${TRACK_ENDPOINT_URL}?satellite=${satellite}`;
  if (timestamp && points) {
    url = url.concat(`&timestamp=${timestamp}&points=${points}`);
  }
  return {
    type: 'LOAD_TRACK',
    // eslint-disable-next-line no-undef
    payload: fetch(url).then(response => response.json()),
  };
};
