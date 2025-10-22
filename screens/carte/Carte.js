import React, { Component, useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import MapView, { Callout, Geojson, Marker } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loading from '../../components/Loading';
import BluetothList from '../../components/bluetothList/BluetothList';
import { carteText } from '../../helpers';
//import Geojson from 'react-native-geojson';
import { MultiSelect } from 'react-native-element-dropdown';
import { functions } from '../../helpers/Constants';
const troncon1 = require('../../helpers/GeoJson/Troncon1.json');
const troncon3 = require('../../helpers/GeoJson/Troncon3.json');
const troncon4 = require('../../helpers/GeoJson/Troncon4.json');
const troncon5 = require('../../helpers/GeoJson/Troncon5.json');
const troncon7 = require('../../helpers/GeoJson/Troncon7.json');
const troncon7bis = require('../../helpers/GeoJson/Troncon7bis.json');
const troncon11 = require('../../helpers/GeoJson/Troncon11.json');
const unite1 = require('../../helpers/GeoJson/Unite1.json');
const unite2 = require('../../helpers/GeoJson/Unite2.json');
const unite3 = require('../../helpers/GeoJson/Unite3.json');
const unite4 = require('../../helpers/GeoJson/Unite4.json');
const unite5 = require('../../helpers/GeoJson/Unite5.json');
const unite6 = require('../../helpers/GeoJson/Unite6.json');
const unite7 = require('../../helpers/GeoJson/Unite7.json');
const unite8 = require('../../helpers/GeoJson/Unite8.json');
const unite9 = require('../../helpers/GeoJson/Unite9.json');
const unite10 = require('../../helpers/GeoJson/Unite10.json');
const unite11 = require('../../helpers/GeoJson/Unite11.json');
const unite12 = require('../../helpers/GeoJson/Unite12.json');
const unite13 = require('../../helpers/GeoJson/Unite13.json');
const unite14 = require('../../helpers/GeoJson/Unite14.json');
const unite15 = require('../../helpers/GeoJson/Unite15.json');
const unite16 = require('../../helpers/GeoJson/Unite16.json');
const unite17 = require('../../helpers/GeoJson/Unite17.json');
const unite18 = require('../../helpers/GeoJson/Unite18.json');
const cdl = require('../../helpers/GeoJson/CDL_BNGT.json');
const rbd = require('../../helpers/GeoJson/RBD_BNGT.json');

const { height, width } = Dimensions.get('window')
const screenHeight = Dimensions.get('screen').height;
const bottomNavBarHeight = screenHeight - height;

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Erreur capturée dans ErrorBoundary :", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Une erreur est survenue. Merci de réessayer plus tard.</Text>;
    }
    return this.props.children;
  }
}

const Carte = props => {
  const { navigation, route } = props


  const [search, onChangeSearch] = useState('');
  const [text, setText] = useState({})
  const [loading, setLoading] = useState(true)
  const [region, setRegion] = useState({
    latitude: 16.450244266478187,
    longitude: -61.47228240966797,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15
  })
  const [mapType, setMapType] = useState('standard');
  const [markers, setMarkers] = useState([]);
  const [allMarker, setAllMarker] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [dataMarkers, setDataMarkers] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lang, setLang] = useState('fr');
  const [translate, setTranslate] = useState([]);
  const [refreshMap, setRefreshMap] = useState(true);
  const [followUser, setFollowUser] = useState(false);
  const [colorFollowUser, setColorFollowUser] = useState('grey');
  const [rbdEstAffiche, setRbdEstAffiche] = useState(false);
  const [cdlEstAffiche, setCdlEstAffiche] = useState(false);

  useEffect(() => {
    const getTranslate = async () => {
      let transt = await functions.getStore('@translate')
      transt = JSON.parse(transt)

      setTranslate(transt.filter(item => item.type === "Interet"))
    }

    getTranslate()

  }, [])

  const onChangeMarkers = (value) => {
    setFilteredMarkers(value);
    updateMap(value);
  };

  useEffect(() => {
    functions.getLang()
      .then(lang => {
        setLang(lang)
      })
  }, [])

  useFocusEffect(
    useCallback(() => {
    }, [])
  );

  const getThemeTranslate = interet_id => translate.filter(item => item.interet_id === interet_id && (lang == "en" ? item.lang === undefined : item.lang == lang))

  const getThemeLangText = interet => lang === 'fr' ? interet : (translate.length > 0 ? (getThemeTranslate(interet.reference).length > 0 ? getThemeTranslate(interet.reference)[0] : interet) : interet)

  const searchText = lang === 'fr' ? 'Rechercher' :
                      lang === 'es' ? 'Buscar' :
                      lang === 'cr' ? 'Chèché' :
                      'Search'

  const selectedText = lang === 'fr' ? 'Sélectionné(s)' :
                        lang === 'es' ? 'Seleccionado(s)' :
                        lang === 'cr' ? 'Chwazi' :
                        'Selected'

  function trad(param, trans) {
    if (lang != 'fr') {
      var result = []
      result = trans.filter(item => item.interet_id === param.reference && (lang == "en" ? item.lang === undefined : item.lang == lang))

      if (result.length > 0) {
        param.titre = result[0].titre
        param.description = result[0].description
      }
    }

    return param;
  }

  useEffect(() => {
    if (props?.route?.params?.troncon == '1') {
      setRegion({
        latitude: 16.389858,
        longitude: -61.488702,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    if (props?.route?.params?.troncon == '3') {
      setRegion({
        latitude: 16.449086,
        longitude: -61.529013,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    if (props?.route?.params?.troncon == '4') {
      setRegion({
        latitude: 16.509729,
        longitude: -61.471832,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    if (props?.route?.params?.troncon == '5') {
      setRegion({
        latitude: 16.463007,
        longitude: -61.418404,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    if (props?.route?.params?.troncon == '7') {
      setRegion({
        latitude: 16.363912,
        longitude: -61.394711,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    if (props?.route?.params?.troncon == '7.5') {
      setRegion({
        latitude: 16.353757,
        longitude: -61.390705,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    if (props?.route?.params?.troncon == '11') {
      setRegion({
        latitude: 16.344167,
        longitude: -61.463414,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
    if (props?.route?.params?.unite == '1') {
      setRegion({
        latitude: 16.422403,
        longitude: -61.524013,
        latitudeDelta: 0.05,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '2') {
      setRegion({
        latitude: 16.444075,
        longitude: -61.528992,
        latitudeDelta: 0.05,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '3') {
      setRegion({
        latitude: 16.470540,
        longitude: -61.512210,
        latitudeDelta: 0.05,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '4') {
      setRegion({
        latitude: 16.500893,
        longitude: -61.484632,
        latitudeDelta: 0.06,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '5') {
      setRegion({
        latitude: 16.502261,
        longitude: -61.463345,
        latitudeDelta: 0.04,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '6') {
      setRegion({
        latitude: 16.494371,
        longitude: -61.446673,
        latitudeDelta: 0.02,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '7') {
      setRegion({
        latitude: 16.472956,
        longitude: -61.425635,
        latitudeDelta: 0.05,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '8') {
      setRegion({
        latitude: 16.452275,
        longitude: -61.415378,
        latitudeDelta: 0.04,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '9') {
      setRegion({
        latitude: 16.342553,
        longitude: -61.462175,
        latitudeDelta: 0.04,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '10') {
      setRegion({
        latitude: 16.349318,
        longitude: -61.478378,
        latitudeDelta: 0.04,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '11') {
      setRegion({
        latitude: 16.351369,
        longitude: -61.487410,
        latitudeDelta: 0.05,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '12') {
      setRegion({
        latitude: 16.380407,
        longitude: -61.492854,
        latitudeDelta: 0.05,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '13') {
      setRegion({
        latitude: 16.384590,
        longitude: -61.490087,
        latitudeDelta: 0.05,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '14') {
      setRegion({
        latitude: 16.390621,
        longitude: -61.488428,
        latitudeDelta: 0.06,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '15') {
      setRegion({
        latitude: 16.390391,
        longitude: -61.496965,
        latitudeDelta: 0.04,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '16') {
      setRegion({
        latitude: 16.392414,
        longitude: -61.404984,
        latitudeDelta: 0.02,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '17') {
      setRegion({
        latitude: 16.369866,
        longitude: -61.399813,
        latitudeDelta: 0.05,
        longitudeDelta: 0.01,
      });
    }
    if (props?.route?.params?.unite == '18') {
      setRegion({
        latitude: 16.339752,
        longitude: -61.374183,
        latitudeDelta: 0.04,
        longitudeDelta: 0.01,
      });
    }

    carteText.getText()
      .then(text => {
        props.navigation.setOptions({
          title: text.titre,
        });
        setText(text)
        setLoading(false)
      })

    const getData = async () => {
      var traductions = [];
      let transt = await functions.getStore('@translate')
      transt = JSON.parse(transt)
      traductions = transt.filter(item => item.type === "Interet")
      setTranslate(traductions)

      var centresInterets = [];
      if (lang !== '') {
        let data = await functions.getStore('@interets'), result = []
        data = JSON.parse(data)

        data.forEach(item => {
          result.push(trad(item, traductions))
          if (afficheCentreInteret(trad(item, traductions))) {
            centresInterets.push(trad(item, traductions))
          }
        })

        setAllMarker(result)
        setMarkers(centresInterets)

        var ddl = []
        result.forEach((item, i) => {
          var obj = { 'value': trad(item, traductions).titre, 'label': trad(item, traductions).titre }
          var found = false;
          for (var i = 0; i < ddl.length; i++) {
            if (ddl[i].value == obj.value) {
              found = true;
              break;
            }
          }
          if (!found) {
            ddl.push(obj)
          }
        });
        ddl.sort((a, b) => a.label.localeCompare(b.label));
        setDataMarkers(ddl)
        setLoading(false)
      }
    }

    getData()

  }, [lang])


  function updateMap(value) {
    var result = []

    value.forEach((item, i) => {
      allMarker.forEach((itemBis, j) => {
        if (item == itemBis.titre) {
          result.push(itemBis)
        }
      });
    });

    setMarkers(result);
  }

  function afficheTheme(id) {
    navigation.navigate("Interet", { theme: id, titre: id.titre })
  }

  function changeMapType() {
    if (mapType == 'standard') {
      setMapType('satellite');
    }
    else {
      setMapType('standard');
    }
  }

  function changeFollowUserLocation() {
    if (followUser == true) {
      setFollowUser(false);
      setColorFollowUser('grey');
    }
    else {
      setFollowUser(true);
      setColorFollowUser('green');
    }
  }

  function afficheTroncon() {
    if (props?.route?.params?.troncon == 1) {
      return (<Geojson
        geojson={troncon1}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.troncon == 3) {
      return (<Geojson
        geojson={troncon3}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.troncon == 4) {
      return (<Geojson
        geojson={troncon4}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.troncon == 5) {
      return (<Geojson
        geojson={troncon5}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.troncon == 7) {
      return (<Geojson
        geojson={troncon7}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.troncon == 7.5) {
      return (<Geojson
        geojson={troncon7bis}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.troncon == 11) {
      return (<Geojson
        geojson={troncon11}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
  }

  function afficheUnite() {
    if (props?.route?.params?.unite == '1') {
      return (<Geojson
        geojson={unite1}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '2') {
      return (<Geojson
        geojson={unite2}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '3') {
      return (<Geojson
        geojson={unite3}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '4') {
      return (<Geojson
        geojson={unite4}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '5') {
      return (<Geojson
        geojson={unite5}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '6') {
      return (<Geojson
        geojson={unite6}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '7') {
      return (<Geojson
        geojson={unite7}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '8') {
      return (<Geojson
        geojson={unite8}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '9') {
      return (<Geojson
        geojson={unite9}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '10') {
      return (<Geojson
        geojson={unite10}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '11') {
      return (<Geojson
        geojson={unite11}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '12') {
      return (<Geojson
        geojson={unite12}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '13') {
      return (<Geojson
        geojson={unite13}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '14') {
      return (<Geojson
        geojson={unite14}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '15') {
      return (<Geojson
        geojson={unite15}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '16') {
      return (<Geojson
        geojson={unite16}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '17') {
      return (<Geojson
        geojson={unite17}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
    if (props?.route?.params?.unite == '18') {
      return (<Geojson
        geojson={unite18}
        strokeColor="red"
        strokeWidth={4}
      />)
    }
  }

  function afficheRBD() {
    if (rbdEstAffiche) {
      return (<Geojson
        geojson={rbd}
        strokeColor="green"
        strokeWidth={2}
      />)
    }
  }

  function afficheCDL() {
    if (cdlEstAffiche) {
      return (<Geojson
        geojson={cdl}
        strokeColor="blue"
        strokeWidth={2}
      />)
    }
  }

  function afficheCentreInteret(obj) {
    if (obj.priorite == 1 || obj.priorite == -2) {
      if (obj.unite.toString() == props?.route?.params?.unite) {
        return true;
      }
      if (obj.thematique != null && obj.thematique !== 'undefined' && obj.thematique == props?.route?.params?.thematique) {
        return true;
      }
      if ((obj.unite == 1 || obj.unite == 2 || obj.unite == 3) && (props?.route?.params?.troncon == '3')) {
        return true;
      }
      if ((obj.unite == 4 || obj.unite == 5 || obj.unite == 6) && (props?.route?.params?.troncon == '4')) {
        return true;
      }
      if ((obj.unite == 7 || obj.unite == 8) && (props?.route?.params?.troncon == '5')) {
        return true;
      }
      if ((obj.unite == 12 || obj.unite == 13 || obj.unite == 14 || obj.unite == 15) && (props?.route?.params?.troncon == '1')) {
        return true;
      }
      if ((obj.unite == 16 || obj.unite == 17 || obj.unite == 18) && (props?.route?.params?.troncon == '7')) {
        return true;
      }
      if ((obj.unite == 9 || obj.unite == 10 || obj.unite == 11) && (props?.route?.params?.troncon == '11')) {
        return true;
      }

      return false;
    }
    else {
      return false;
    }
  }

  function addNewlines(str, n) {
    var result = '';
    while (str?.length > 0) {
      var found = false;
      var min = str?.length < n + 10 ? str?.length : n + 10;
      for (var i = n; i <= min; i++) {
        if (str[i] === ' ' || str[i] == '.') {
          found = true;
          result += str.substring(0, i + 1) + '\n';
          str = str.substring(i + 1);
        }
      }

      if (!found) {
        result += str.substring(0, min) + '\n';
        str = str.substring(min);
      }
    }
    return result;
  }

  function arrayContain(tab, chaine) {
    for (var i = 0; i < tab.length; i++) {
      if (tab[i] == chaine) {
        return true
      }
    }
    return false;
  }

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

  const changeRegion = (region) => {
    setZoomLevel(Math.log2(360 * (width / 256 / region.longitudeDelta)) + 1)
  }


  const getCalloutTitleWidth = (chaine) => {
    if (chaine?.length > 40) return width * 0.9
    if (chaine?.length > 35) return width * 0.8
    if (chaine?.length > 30) return width * 0.7
    if (chaine?.length > 25) return width * 0.6
    if (chaine?.length > 20) return width * 0.5
    if (chaine?.length > 15) return width * 0.4
    if (chaine?.length > 10) return width * 0.3
    return null;
  }

  const getCalloutDescriptionWidth = (chaine) => {
    if (chaine?.length > 150) return width * 0.9
    if (chaine?.length > 100) return width * 0.7
    if (chaine?.length > 70) return width * 0.5
    return null;
  }

  const truncateDescription = (description) => {
    if (!description) return '';
    return description.length > 150 ? description.substring(0, 150) + '...' : description;
  };


  const getCalloutWitdh = (item) => {
    if (getCalloutDescriptionWidth(item.description) == null && getCalloutTitleWidth(item.titre) == null) return 100
    if (getCalloutDescriptionWidth(item.description) == null) return getCalloutTitleWidth(item.titre)
    if (getCalloutTitleWidth(item.titre) == null) return getCalloutDescriptionWidth(item.description)

    return getCalloutDescriptionWidth(item.description) > getCalloutTitleWidth(item.titre) ? getCalloutDescriptionWidth(item.description) : getCalloutTitleWidth(item.titre)

  }
  const getCalloutStyle = (item) => {
    var ret = getCalloutWitdh(item)
    console.log("title", item.titre.length, getCalloutTitleWidth(item.titre), "desc", getCalloutDescriptionWidth(item.description), "ret", ret)
    return ret < 100 ? 100 : ret
  }

  return loading ? <Loading /> : (
    <View style={styles.container}>
        <BluetothList navigation={navigation}/>
      <View style={[styles.bloc__recherche, { height: Math.min(40 + filteredMarkers.length * 5, 300) }]}>
        <MultiSelect
          style={{ fontFamily: "popLight", width: "100%", color: "#299bc4", backgroundColor: 'white', height: 50 }}
          //label='Selection'
          data={dataMarkers}
          //enableSearch
          searchPlaceholder={searchText}
          selectedItemsText={selectedText}
          //emptySelectionText=''
          value={filteredMarkers}
          onChange={onChangeMarkers}
          //defaultSortOrder='asc'
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={{ fontFamily: "popLight", color: "blue"}}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          search
          labelField="label"
          valueField="value"
          placeholder={selectedText}
          /*renderLeftIcon={() => (
             <Ionicons
            name='safety'
            type='font-awesome-5'
            color='#299bc4'
            size={16}
          ></Ionicons>
          )}*/
         renderItem={(item, selected) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: selected ? '#e0f0ff' : 'white',
              }}
            >
              <Text style={{ flex: 1, color: '#000' }}>{item.label}</Text>
              {selected && (
                <Ionicons name="checkmark" size={16} color="#299bc4" />
              )}
            </View>
          )}
          selectedStyle={styles.selectedStyle}
          containerStyle={{ padding: 0, margin: 0 }}
        />
      </View>

      <View style={styles.bloc__carte}>

        <MapView
          style={{ flex: 1 }}
          initialRegion={region}
          showsUserLocation={true}
          followsUserLocation={followUser}
          mapType={mapType}
          customMapStyle={mapStyle}
          onRegionChangeComplete={changeRegion}
        >
          {afficheRBD()}
          {afficheCDL()}
          {afficheTroncon()}
          {afficheUnite()}
          {markers.map((item) => {
            return (
              <Marker
                key={item.identifiant}
                coordinate={{ latitude: parseFloat(item.latitude?.toString()?.replace(',', '.')), longitude: parseFloat(item.longitude?.toString()?.replace(',', '.')) }}
                title={item.titre}
                //onPress={() => { if (refreshMap) { navigation.navigate("CarteRefresher"); setRefreshMap(false) } }}
              >
                <View style={{ 
                  flex: 1,
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                  /*height: 80,*/
                  width: 120, }}>
                  <Text style={{ textAlign: 'center', width: '100%', display: (((item.zoomLevel !== 'undefined' && parseInt(item.zoomLevel) < zoomLevel) || arrayContain(filteredMarkers, item.titre)) ? 'flex' : 'none') }}>{item.titre}</Text>
                  {item.priorite == -2 ?
                    <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/location_interdit.png')}></Image>
                    : item.categorie == "1717441754" ? <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/location_hostel.png')}></Image>
                    : item.categorie == "1626952263" ? <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/location_equipment.png')}></Image>
                    : item.categorie == "1626952235" ? <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/location_info.png')}></Image>
                    : item.categorie == "1626952177" ? <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/location_natural.png')}></Image>
                    : item.categorie == "1626951535" ? <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/location_historical.png')}></Image>
                    : <Image style={{ alignSelf: 'center' }} source={require('../../assets/images/location.png')}></Image>
                  }
                </View>
                <Callout onPress={() => { afficheTheme(item) }}>
                  <View
                    style={{ width: getCalloutStyle(item) }}
                  >
                    <Text style={{ fontWeight: 'bold', flex: 1, textAlign: 'center' }}>{item.titre}</Text>
                    <Text style={{ flex: 1, flexWrap: 'wrap' }}>{truncateDescription(item.description)}</Text>
                    <Ionicons
                      style={{
                        alignSelf: 'flex-end',
                        textDecorationLine: 'underline',
                        color: 'blue'
                      }}
                      name='eye'
                      type='font-awesome-5'
                      size={14}
                    > {lang === 'fr' ? 'en savoir +' :
                    lang === 'es' ? 'más' :
                    lang === 'cr' ? 'plis' :
                    'more'}</Ionicons>
                  </View>
                </Callout>
              </Marker>
            )
          })}
        </MapView>
        <View
          style={{
            // position: 'absolute',//use absolute position to show button on top of the map
            // top: '2%', //for center align
            //  alignSelf: 'flex-start' //for align to right
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >

          <Ionicons
            style={{
              marginLeft: Platform.OS == "ios" ? 10 : 50,
            }}
            name='layers'
            type='font-awesome-5'
            color='#299bc4'
            size={32}
            onPress={() => { changeMapType() }}
          ></Ionicons>
          <Ionicons
            style={{
              marginLeft: 10
            }}
            name='walk'
            type='font-awesome-5'
            color={colorFollowUser}
            size={32}
            onPress={() => { changeFollowUserLocation() }}
          ></Ionicons>

          <TouchableOpacity style={{

          }} onPress={() => { rbdEstAffiche ? setRbdEstAffiche(false) : setRbdEstAffiche(true) }}>
            <Image source={require("../../assets/images/RBD.png")} />
          </TouchableOpacity>
          <TouchableOpacity style={{

          }} onPress={() => { cdlEstAffiche ? setCdlEstAffiche(false) : setCdlEstAffiche(true) }}>
            <Image source={require("../../assets/images/CDL.png")} />
          </TouchableOpacity>
        </View>
        <View style={{
              height: Platform.OS == "ios" ? 0 : 50,
              backgroundColor: 'white'
            }}></View>
      </View>

    </View>
  )
}

export default Carte

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "white"
  },
  bloc__recherche: {
    position: 'absolute',
    top: 0,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  bloc__carte: {
    width: "100%",
    height: "100%"
  },
  map: {
    width: "100%",
    height: "100%"
  },
    placeholderStyle: {
      fontSize: 16,
      paddingLeft: 10,
      paddingRight: 10
    },
    selectedTextStyle: {
      fontSize: 14,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    icon: {
      marginRight: 5,
    },
    selectedStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
      backgroundColor: 'white',
      shadowColor: '#000',
      marginTop: 2,
      marginRight: 2,
      paddingHorizontal: 5,
      paddingVertical: 2,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,

      elevation: 2,
    },

})
