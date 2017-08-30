import React, { Component } from 'react';
import { withGoogleMap, GoogleMap } from 'react-google-maps';

import Satellite from './Satellite';
import { COLORS } from '../config';


class Map extends Component {

  constructor() {
    super();
    this.state = {
      intervalTimeout: 240000,
      intervalEnabled: true,
      staticDate: new Date(),
      date: new Date(),
    };
  }

// eslint-disable-next-line class-methods-use-this
  renderSatellites() {
    const satelliteList = ['noaa-19', 'noaa-18'];  // TODO: get list from user's data
    return satelliteList.map((satellite, i) => {
      const color = COLORS[i];
      return (
        <Satellite
          key={satellite}
          satellite={satellite}
          color={color}
        />
      );
    });
  }

  renderMap() {
    const GettingStartedGoogleMap = withGoogleMap(() => (
      <GoogleMap
        defaultZoom={2}
        defaultCenter={{ lat: -22.49947, lng: 94.61294 }}
        options={{ streetViewControl: false }}
      >
        {this.renderSatellites()}
      </GoogleMap>
    ));
    return (
      <GettingStartedGoogleMap
        containerElement={
          <div style={{ height: '100%' }} />
        }
        mapElement={
          <div style={{ height: '100%' }} />
        }
      />
    );
  }

  render() {
    return (
      <div className={'map-container'}>
        {this.renderMap()}
      </div>
    );
  }
}

export default Map;
