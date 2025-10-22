import React, {useEffect, useState} from 'react'
import { StyleSheet, View, StatusBar, TextInput, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

import MapView, {Marker, Callout} from 'react-native-maps'
import Geojson from 'react-native-geojson';
const troncon3 = require('../helpers/GeoJson/Troncon3.json');
const troncon4 = require('../helpers/GeoJson/Troncon4.json');
const troncon5 = require('../helpers/GeoJson/Troncon5.json');
const unite1 = require('../helpers/GeoJson/Unite1.json');
const unite2 = require('../helpers/GeoJson/Unite2.json');
const unite3 = require('../helpers/GeoJson/Unite3.json');
const unite4 = require('../helpers/GeoJson/Unite4.json');
const unite5 = require('../helpers/GeoJson/Unite5.json');
const unite6 = require('../helpers/GeoJson/Unite6.json');
const unite7 = require('../helpers/GeoJson/Unite7.json');
const unite8 = require('../helpers/GeoJson/Unite8.json');

class Carte extends React.Component {
  constructor(props) {
  super(props)

  this.state = {
    urlTemplate: 'http://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    mapType: 'satellite',
    region: null,
    afficherParcours: false
  }
}

componentDidMount(){
  if(this.props.unite == '1' || this.props.unite == '2' || this.props.unite == '3' || this.props.troncon == '3')
  {
    this.setState({region: {
                latitude: 16.448900426506288,
                longitude: -61.535868871956012,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
    }});
  }
  if(this.props.unite == '4' || this.props.unite == '5' || this.props.unite == '6' || this.props.troncon == '4')
  {
    this.setState({region: {
                latitude: 16.509811257218146,
                longitude: -61.467240415796795,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
    }});
  }
  if(this.props.unite == '7' || this.props.unite == '8' || this.props.troncon == '5')
  {
    this.setState({region: {
                latitude: 16.459899974495748,
                longitude: -61.408779981077629,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
    }});
  }
}

getInitialState() {
  return {
    region: {
                latitude: 16.2667,
                longitude: -61.5833,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
    },
  };
}

changeMapStyle(){
  if(this.state.mapType == 'standard')
  {
    this.setState({mapType: 'satellite'})
  }
  else
  {
    this.setState({mapType: 'standard'})
  }
}

afficheTroncon(){
  if(this.props.unite == '1' || this.props.unite == '2' || this.props.unite == '3' || this.props.troncon == '3')
  {
    return (<Geojson
          geojson={troncon3}
          strokeColor="red"
          strokeWidth={1}
        />)
  }
  if(this.props.unite == '4' || this.props.unite == '5' || this.props.unite == '6' || this.props.troncon == '4')
  {
    return (<Geojson
          geojson={troncon4}
          strokeColor="red"
          strokeWidth={1}
        />)
  }
  if(this.props.unite == '7' || this.props.unite == '8' || this.props.troncon == '5')
  {
    return (<Geojson
          geojson={troncon5}
          strokeColor="red"
          strokeWidth={1}
        />)
  }
}

afficheUnite(){
  if(this.props.unite == '1')
  {
    return (<Geojson
          geojson={unite1}
          strokeColor="red"
          strokeWidth={4}
        />)
  }
  if(this.props.unite == '2')
  {
    return (<Geojson
          geojson={unite2}
          strokeColor="red"
          strokeWidth={4}
        />)
  }
  if(this.props.unite == '3')
  {
    return (<Geojson
          geojson={unite3}
          strokeColor="red"
          strokeWidth={4}
        />)
  }
  if(this.props.unite == '4')
  {
    return (<Geojson
          geojson={unite4}
          strokeColor="red"
          strokeWidth={4}
        />)
  }
  if(this.props.unite == '5')
  {
    return (<Geojson
          geojson={unite5}
          strokeColor="red"
          strokeWidth={4}
        />)
  }
  if(this.props.unite == '6')
  {
    return (<Geojson
          geojson={unite6}
          strokeColor="red"
          strokeWidth={4}
        />)
  }
  if(this.props.unite == '7')
  {
    return (<Geojson
          geojson={unite7}
          strokeColor="red"
          strokeWidth={4}
        />)
  }
  if(this.props.unite == '8')
  {
    return (<Geojson
          geojson={unite8}
          strokeColor="red"
          strokeWidth={4}
        />)
  }
}

_displayMap(){
  const mapStyle = [
  {
  "featureType": "administrative.land_parcel",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
  },
  {
  "featureType": "administrative.neighborhood",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
  },
  {
  "featureType": "poi",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
  }
  ];


  if(this.props.unite !== 'undefined'){
  return (<View style={{ flex: 1 }}><MapView
      style={{ flex: 1 }}
      initialRegion={this.state.region}
      showsUserLocation={true}
      followsUserLocation={true}
      mapType={this.state.mapType}
      customMapStyle={mapStyle}
    >
      {this.afficheTroncon()}
      {this.afficheUnite()}
      {this.props.markers.map((item) => {
        return (
          <Marker
          key={item.title}
          coordinate={{latitude: item.latitude, longitude: item.longitude}}
          title={item.title}
          >
            <Callout onPress={()=>{}}>
              <View
                  style={{
                    height:'100%',
                    width:'100%',
                  }}
              >
                <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>{item.titre}</Text>
                <Text style={{alignSelf: 'center'}}>{item.description}</Text>
                <Text style={{alignSelf: 'center'}}><Text style={{fontWeight: 'bold'}}>Ville:</Text> {item.commune}</Text>
              </View>
            </Callout>
          </Marker>
      )})}
    </MapView>
  <View
    style={{
        position: 'absolute',//use absolute position to show button on top of the map
        top: '2%', //for center align
        alignSelf: 'flex-start' //for align to right
    }}
  >
    <Ionicons
      style={{
          marginLeft: 30
      }}
      name='layers'
      type='font-awesome-5'
      color='#299bc4'
      size={32}
      onPress={()=>{this.changeMapStyle()}}
    ></Ionicons>
    </View></View>)
  }
  else{

  }
}

render() {
  var mapStyle=[{"elementType": "geometry", "stylers": [{"color": "#242f3e"}]},{"elementType": "labels.text.fill","stylers": [{"color": "#746855"}]},{"elementType": "labels.text.stroke","stylers": [{"color": "#242f3e"}]},{"featureType": "administrative.locality","elementType": "labels.text.fill","stylers": [{"color": "#d59563"}]},{"featureType": "poi","elementType": "labels.text.fill","stylers": [{"color": "#d59563"}]},{"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#263c3f"}]},{"featureType": "poi.park","elementType": "labels.text.fill","stylers": [{"color": "#6b9a76"}]},{"featureType": "road","elementType": "geometry","stylers": [{"color": "#38414e"}]},{"featureType": "road","elementType": "geometry.stroke","stylers": [{"color": "#212a37"}]},{"featureType": "road","elementType": "labels.text.fill","stylers": [{"color": "#9ca5b3"}]},{"featureType": "road.highway","elementType": "geometry","stylers": [{"color": "#746855"}]},{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"color": "#1f2835"}]},{"featureType": "road.highway","elementType": "labels.text.fill","stylers": [{"color": "#f3d19c"}]},{"featureType": "transit","elementType": "geometry","stylers": [{"color": "#2f3948"}]},{"featureType": "transit.station","elementType": "labels.text.fill","stylers": [{"color": "#d59563"}]},{"featureType": "water","elementType": "geometry","stylers": [{"color": "#17263c"}]},{"featureType": "water","elementType": "labels.text.fill","stylers": [{"color": "#515c6d"}]},{"featureType": "water","elementType": "labels.text.stroke","stylers": [{"color": "#17263c"}]}];

  return (
this._displayMap()
  );
}
}

export default Carte
