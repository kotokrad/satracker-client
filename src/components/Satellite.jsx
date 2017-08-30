import React, { Component } from 'react';
import ReactInterval from 'react-interval';
import { Polyline, Marker, Circle } from 'react-google-maps';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { loadTrack } from '../actions';
import { toShortDate } from '../utils/satelliteUtils';

class Satellite extends Component {

  static getPosition(track) {
    const diff = toShortDate(new Date()) - track[0].t;
    const position = track[diff];
    if (position) {
      return position;
    }
    throw new Error('Obsolete track');
  }

  static getFootprint(position) {
    const EARTH_RADIUS = 6371;
    const tangent = Math.sqrt(position.h
                      * (position.h + (2 * EARTH_RADIUS)));
    const centerAngle = Math.asin(tangent / (position.h + EARTH_RADIUS));
    const footprint = (centerAngle * EARTH_RADIUS) * 1000;
    return footprint;
  }

  constructor() {
    super();
    this.state = {
      pointIntervalTimeout: 1000,
      pointIntervalEnabled: true,
      trackIntervalTimeout: 10000,
      trackIntervalEnabled: true,
      position: 0,
      footprint: 0,
    };
  }

  componentWillMount() {
    this.props.updateTrack(this.props.satellite);
  }

  updateSatelliteData() {
    const satellite = this.props.satellite;
    const track = this.props.track[satellite];
    let position;
    try {
      position = Satellite.getPosition(track);
    } catch (e) {
      // console.log('Error:', e.message);
      this.setState({
        intervalEnabled: false,
      });
      position = track[track.length - 1];
    } finally {
      const footprint = Satellite.getFootprint(position);
      this.setState({
        position,
        footprint,
      });
    }
  }

  render() {
    const satellite = this.props.satellite;
    if (!this.props.track || !this.props.track[satellite] || !this.props.track[satellite].length) {
      // console.log(`Satellite ${satellite} is loading...`);
      return <noscript />;
    }
    const track = this.props.track[satellite];
    const position = this.state.position;
    const footprint = this.state.footprint;
    return (
      <div>
        <Polyline
          mapHolderRef={this.props.mapHolderRef}
          options={{
            path: track,
            geodesic: true,
            strokeColor: this.props.color,
            strokeOpacity: 0.7,
            strokeWeight: 2,
          }}
        />
        <Marker
          mapHolderRef={this.props.mapHolderRef}
          position={position}
          icon="/images/satellite.png"
        />
        <Circle
          mapHolderRef={this.props.mapHolderRef}
          options={{
            strokeColor: this.props.color,
            strokeOpacity: 0.5,
            strokeWeight: 0.5,
            fillColor: this.props.color,
            fillOpacity: 0.2,
            center: position,
            radius: footprint,
          }}
        />
        <ReactInterval
          timeout={this.state.pointIntervalTimeout}
          enabled={this.state.pointIntervalEnabled &&
            this.props.track[satellite] &&
            this.props.track[satellite].length}
          callback={() => {
            this.updateSatelliteData();
          }}
        />
        <ReactInterval
          timeout={this.state.trackIntervalTimeout}
          enabled={this.state.trackIntervalEnabled &&
            this.props.track[satellite] &&
            this.props.track[satellite].length}
          callback={() => {
            this.props.updateTrack(this.props.satellite,
              _.last(this.props.track[satellite]).t, 10);
          }}
        />
      </div>
    );
  }
}

Satellite.propTypes = {
  satellite: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  track: PropTypes.objectOf(PropTypes.array).isRequired,
  updateTrack: PropTypes.func.isRequired,
  mapHolderRef: PropTypes.objectOf(PropTypes.any),
};

Satellite.defaultProps = {
  mapHolderRef: {},
};

const mapStateToProps = state => (
  {
    track: state.track,
  }
);

const mapDispatchToProps = dispatch => (
  {
    updateTrack: (satellite, timestamp, points) => {
      dispatch(loadTrack(satellite, timestamp, points));
    },
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Satellite);
