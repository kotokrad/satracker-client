const env = process.env.NODE_ENV || 'development';

// eslint-disable-next-line import/prefer-default-export
export const TRACK_ENDPOINT_URL = env === 'development' ? 'http://localhost:4000/track' : 'https://satracker.herokuapp.com/track';

export const COLORS = [
  '#EF4836',
  '#2ECC71',
  '#3498DB',
  '#E87E04',
  '#BF55EC',
];
