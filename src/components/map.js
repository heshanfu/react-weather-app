import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import Header from './header';
import Weather from './weather';

  const MyMap = withScriptjs(withGoogleMap(props =>
    <GoogleMap
      defaultZoom={6}
      onClick={ props.onMapClick }
      defaultCenter={{ lat: props.latitude, lng: props.longitude }}
    >
      <Marker
        position={{ lat: props.latitude, lng: props.longitude }}
      />
    </GoogleMap>
  ));

  class Map extends Component {

    constructor(props) {
        super(props);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.state = {
            latitude: props.lat,
            longitude: props.lng,
            address: props.address,
            city: ''
        }
    }

    ReverseGeocoding = (lat, lng) => {
      let GEO_URL_HOME = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAutjbbZSVrwGSKMFq6F4b2wr4XHkssclk&latlng=";
      GEO_URL_HOME +=  + lat + ',' + lng;
      fetch(GEO_URL_HOME, {method:'GET'})
      .then(response => response.json())
      .then(json => {
        if(json.status !== "ZERO_RESULTS") {
          this.setState({
            address: json.results[1].formatted_address,
            city: json.results[1].formatted_address
          })} else {
            this.setState({
              address: "There's nothing here, please check where you click",
              city: "There's nothing here, please check where you click"
            });
          };
        });
      };

      handleMapClick = (event) => {
        this.setState ({
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng()
        });
        this.ReverseGeocoding(event.latLng.lat(), event.latLng.lng());
      };

      render() {
        return (
          <div>
            <Header latitude={ this.state.latitude } longitude={ this.state.longitude } address={ this.state.address } city={ this.state.city } />
            <MyMap
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAutjbbZSVrwGSKMFq6F4b2wr4XHkssclk&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `400px` }} />}
              mapElement={<div style={{ height: `100%` }} />}
              latitude={ this.state.latitude }
              longitude={ this.state.longitude }
              onMapClick={ this.handleMapClick }
            />
            <Weather latitude={ this.state.latitude } longitude={ this.state.longitude } />
          </div>);
      }
  }

  export default Map;
