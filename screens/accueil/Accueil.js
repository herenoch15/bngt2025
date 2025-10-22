import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    PermissionsAndroid,
    DeviceEventEmitter,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import RNExitApp from 'react-native-exit-app';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Beacons from '@hkpuits/react-native-beacons-manager';
//import Beacons from '@kojongdev/react-native-beacons-manager'
//import Beacons from '@nois/react-native-beacons-manager'
import { useSelector, useDispatch, connect } from 'react-redux'
import Loading from '../../components/Loading';
import BluetothList from '../../components/bluetothList/BluetothList';
import { functions } from '../../helpers/Constants';
import  {
   SET_LIST_POI,
   SET_CURRENT_LISTPOI_BT,
   SET_POPUP_BT
} from '../../store/types/PoiType'
const { height } = Dimensions.get("window")

const Accueil = (props) =>  {
    const dispatch = useDispatch();
   var _currentListPoiBT =[]
    var currentListPoiBT = useSelector((state) => state.Poi.currentListPoiBT);
    const { navigation } = props
    const bs = useRef(null)
    const [text1, setText1] = useState({})
    const [translate, setTranslate] = useState([])
    const [loading, setLoading] = useState(true)
    const [lang, setLang] = useState('fr')

    var beaconsMet = [];
    let mounted = true
    const beaconTitre = lang === 'fr' ? "Centre d'intérêt détecté" :
                    lang === 'es' ? "Punto de interés detectado" :
                    lang === 'cr' ? "Sant enterè detekte" :
                    'Point of interest detected';

    const beaconMessage = lang === 'fr' ? 'Voulez-vous afficher le lieu: ' :
                          lang === 'es' ? '¿Le gustaría ver el lugar: ' :
                          lang === 'cr' ? 'Vle wè kote a: ' :
                          'Would you like to see: ';

    const beaconOui = lang === 'fr' ? 'Découvrir' :
                      lang === 'es' ? 'Descubrir' :
                      lang === 'cr' ? 'Dekouvri' :
                      'Show me';

    const beaconNon = lang === 'fr' ? 'Non, merci!' :
                      lang === 'es' ? 'No, gracias!' :
                      lang === 'cr' ? 'Non, mèsi!' :
                      'No, thanks!';

    // will be set as a reference to "regionDidEnter" event:
    var regionDidEnterEvent = null;
    // will be set as a reference to "regionDidExit" event:
    var regionDidExitEvent = null;
  

   try {
        if (Platform.OS === "android") {
            const granted = PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
        }
    } catch (err) {

    }

    useEffect(() => {
        const getTranslate = async () => {
            let translate = await functions.getStore('@translate')
            translate = JSON.parse(translate)
            setTranslate(translate.filter(item => item.type === "Accueil" && item.lang == lang)[0])
        }
        getTranslate()
        return () => getTranslate()

    }, [lang])
    useEffect(() => {
        functions.getLang()
            .then(lang => {
                setLang(lang)
            })
    }, [])

    useEffect(() => {

        if (bs.current !== null) {
            bs.current.hide()
        }
    }, [loading])

    useEffect(() => {
        

        //let Unmount = () => { }
        const getData = async () => {
            console.log('DEBUT GET BEACONS:::1111')
            let aproposData = await functions.getStore('@apropos')
            //console.log('aproposData::'+ JSON.stringify(aproposData))
           // if (mounted && lang !== '') {
                let data = await functions.getStore('@accueil')
                data = JSON.parse(data)
                data = data[0]
                setText1(data)
                setLoading(false)

                var traductions = [];
                let transt = await functions.getStore('@translate')
                transt = JSON.parse(transt)
                traductions = transt.filter(item => item.type === "Interet")
                console.log('DEBUT GET BEACONS::: TRAD')
                let dataInterets = await functions.getStore('@interets')
                result = []
                dataInterets = JSON.parse(dataInterets)
               // console.log('DEBUT GET BEACONS::: 3333'+ JSON.stringify(dataInterets))
                dataInterets.forEach(item => {
                    if (item?.uuid != null && item?.uuid != '' && item?.uuid !== 'undefined') {
                        result.push(trad(item, traductions))
                    }
                })
                console.log('DEBUT GET BEACONS:::'+result.length)
                if (result.length > 0) {
                    try{
                    getBeacons(result, lang)
                   Unmount = () => UnMountBeacons(result);
                 }
                 catch(error){}
                }
          //  }
        }

        getData()
        return (() => {
            console.log("💢💢💢💢 Dismouting Acceuil called 💢💢💢💢")
            mounted = false
            //Unmount();
        })
    }, [lang]);

    function trad(param, trans)
    {
      if(lang != 'fr')
      {
        var result = []
        result = trans.filter(item => item.interet_id === param.reference && (lang == "en" ? item.lang === undefined : item.lang == lang))

        if(result.length > 0)
        {
            console.log('RES'+result.length );
          param.titre = result[0].titre
        }
      }

      return param;
    }

    const gotToPage = (page, lang) => navigation.navigate(page, { lang: lang })
    const closeApp = () => {
      Alert.alert(
        "Information",
        lang === 'fr' ? 'Voulez-vous fermer l’application ?' :
        lang === 'es' ? '¿Está seguro de que desea volver?' :
        lang === 'cr' ? 'Eske ou sèten ke ou vle pati?' :
        "Are you sure you want to go back?",
        [
          {
            text: lang === 'fr' ? 'Annuler' :
                  lang === 'es' ? 'Cancelar' :
                  lang === 'cr' ? 'Anile' :
                  'Cancel',
            onPress: () => null,
            style: "cancel"
          },
          {
            text: lang === 'fr' ? 'Oui' :
                  lang === 'es' ? 'Sí' :
                  lang === 'cr' ? 'Wi' :
                  'Yes',
            onPress: () => { RNExitApp.exitApp(); }
          }
        ]
        );
    }
    const afficheTheme = (beaconsList, id, beaconsMet, lang) => {

        beaconsList.forEach(item => {
            // console.log("🔥 afficheTheme", item)
            if (item.uuid == id) {
                var found = false;
                for (var i = 0; i < beaconsMet.length; i++) {
                    if (beaconsMet[i] == item.uuid) {
                        found = true;
                        break;
                    }
                }
                //console.log("🔥 afficheTheme", found, item)
                if (!found) {
                    console.log('BEACON'+result.length );
                    Alert.alert(
                        beaconTitre,
                        beaconMessage + "'" + item.titre + "'?",
                        [
                            {
                                text: beaconNon,
                                onPress: () => { },
                                style: "cancel"
                            },
                            { text: beaconOui, onPress: () => navigation.navigate("Interet", { theme: item, titre: item.titre }) }
                        ],
                        { cancelable: true }
                    );
                }
            }
        })
    }
    const getBeacons = async  (beaconsList, lang) => {
                    var incSecondeInit = 0
                    await dispatch({ type: SET_LIST_POI, value: beaconsList })
                    console.log('DEBUT GET BEACONS::::'+ JSON.stringify(beaconsList)) 
                    DeviceEventEmitter.addListener('beaconsDidRange', async (data) => {
                                console.log(' ////// DEBUT beacons // '+ JSON.stringify(data)+ 'NBR::'+JSON.stringify(data))
                                var poiTab = []
                                await data.beacons.forEach((elementPoi) => {
                                let resultFilter=  beaconsList.filter((items, index) => items.uuid.toUpperCase() == elementPoi.uuid.toUpperCase())
                                if(resultFilter.length >0 ) {
                                    poiTab.push(resultFilter[0])
                                    console.log(' beacons BT!',resultFilter[0]) 
                                } 
                                });
                                    if(data.beacons.length>0){
                                        console.log('_currentListPoiBT::'+ JSON.stringify(_currentListPoiBT))
                                        await poiTab.forEach( async (elementPoi) => {
                                            if(_currentListPoiBT.length==0) {
                                                _currentListPoiBT= poiTab
                                                await dispatch({ type: SET_CURRENT_LISTPOI_BT, value: poiTab })
                                                await dispatch({ type: SET_POPUP_BT, value: true })
                                              return
                                            } else
                                            {
                                            let result =  _currentListPoiBT.filter(function (item) { return item.reference == elementPoi.reference })
                                            if(result.length==0) {
                                                _currentListPoiBT= poiTab
                                                await dispatch({ type: SET_CURRENT_LISTPOI_BT, value: poiTab })
                                                await dispatch({ type: SET_POPUP_BT, value: true })
                                                console.log(' ////// poiTab poiTab // '+_currentListPoiBT.length)
                                              return
                                            }
                                            }
                                        })
                                }else {
                                        if(incSecondeInit<8) {
                                        incSecondeInit++;
                                        } else {
                                            incSecondeInit= 0
                                            console.log('NBR BT'+ JSON.stringify(_currentListPoiBT))
                                            _currentListPoiBT= poiTab
                                            if(_currentListPoiBT.length==0) {
                                            
                                                console.log('NO BT'+ JSON.stringify(_currentListPoiBT))
                                                dispatch({ type: SET_CURRENT_LISTPOI_BT, value: _currentListPoiBT })
                                            }
                                        }  
                                }
                                console.log('Found beacons! currentListPoiBT', JSON.stringify(currentListPoiBT)) // Result of ranging

                    })
                    return false
    }

    const UnMountBeacons = (beaconsList) => {
        console.log("💢💢💢💢 UnMountBeacons called 💢💢💢💢")
        if (Platform.OS === 'ios') {
          try{
            // stop monitoring beacons:
            beaconsList.forEach(item => {
                var reg = { identifier: item.uuid, uuid: item.uuid };
                Beacons
                    .stopMonitoringForRegion(reg)
                    .then(() => console.log(`💢 Beacons monitoring stopped succesfully ${item.uuid} 💢`))
                    .catch(error => console.log(`Beacons monitoring not stopped, error: ${error}`));
            });
            Beacons.stopUpdatingLocation();
            if (this.regionDidEnterEvent)
                this.regionDidEnterEvent.remove();
            if (this.regionDidExitEvent)
                this.regionDidExitEvent.remove();
              }
              catch(error){}
        }
    }

    const getLangText = champ => lang === 'fr' ? text1[champ] : translate[champ]
    return loading ? <Loading /> : (
        <View style={styles.container}>
           <BluetothList navigation={navigation}/>
            <ImageBackground style={styles.imgBackground}
                resizeMode='cover'
                source={require('../../assets/images/M0P9YW.png')}>
                <View style={styles.container__logo}>
                    <View style={{ justifyContent: "center", alignItems: "center", marginBottom: -70, width: 100, height: 100, borderRadius: 100 / 2, backgroundColor: "white", }}>
                        <Image
                            source={require('../../assets/images/logo_300.png')}
                            style={{ borderRadius: 90 / 2, width: 90, height: 90 }}
                        />
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
                    <Text style={[styles.titre__ecran]}>{getLangText('titre')}</Text>

                    <View style={styles.container__menue}>

                        <TouchableOpacity style={styles.menue__item} onPress={() => gotToPage("Carte", lang)}>
                            <Ionicons style={styles.icon__menue_item} name="map" size={25} color="#ebdb34" />
                            <Text style={styles.text__menue_item}>{getLangText('carte')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menue__item} onPress={() => gotToPage("Troncon", lang)}>
                            <FontAwesome5 style={styles.icon__menue_item} name="book-reader" size={25} color="#ebdb34" />
                            <Text style={styles.text__menue_item}>{getLangText('troncon')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menue__item} onPress={() => gotToPage("Unite", lang)}>
                            <FontAwesome5 style={styles.icon__menue_item} name="home" size={25} color="#ebdb34" />
                            <Text style={styles.text__menue_item}>{getLangText('unite')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menue__item} onPress={() => gotToPage("Thematique", lang)}>
                            <Ionicons style={styles.icon__menue_item} name="color-palette-sharp" size={25} color="#ebdb34" />
                            <Text style={styles.text__menue_item}>{getLangText('thematique')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menue__item} onPress={() => gotToPage("Recherche", lang)}>
                            <Ionicons style={styles.icon__menue_item} name="search" size={25} color="#ebdb34" />
                            <Text style={styles.text__menue_item}>{getLangText('recherche')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menue__item} onPress={() => gotToPage("Scan", lang)}>
                            <MaterialCommunityIcons style={styles.icon__menue_item} name="qrcode-scan" size={25} color="#ebdb34" />
                            <Text style={styles.text__menue_item}>{getLangText('scan')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menue__item} onPress={() => gotToPage("Apropos", lang)}>
                            <Ionicons style={styles.icon__menue_item} name="home" size={25} color="#ebdb34" />
                            <Text style={styles.text__menue_item}>{getLangText('propos')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menue__item} onPress={() => gotToPage("Update", lang)}>
                            <MaterialIcons style={styles.icon__menue_item} name="update" size={25} color="#ebdb34" />
                            <Text style={styles.text__menue_item}>{lang === 'fr' ? "Mise à jour" :
                                                                  lang === 'es' ? "Actualizar" :
                                                                  lang === 'cr' ? "Mizajou" :
                                                                  "Update"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menue__item} onPress={() => closeApp()}>
                            <MaterialIcons style={styles.icon__menue_item} name="close" size={25} color="#ebdb34" />
                            <Text style={styles.text__menue_item}>{lang === 'fr' ? "Fermer l'application" :
                                                                    lang === 'es' ? "Cerrar la aplicación" :
                                                                    lang === 'cr' ? "Kité aplikasyon la" :
                                                                    "Close app"}</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>

                <View style={styles.container__footer}>
                    <SimpleLineIcons style={styles.icon__footer} name="arrow-up" size={30} color="#ebdb34" onPress={() => bs.current.show()} />
                    <Text style={styles.text__footer}>{getLangText('footer').titre}</Text>
                </View>
                <SlidingUpPanel ref={bs} allowDragging={false}>
                    <View style={styles.slidingUpPanel}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ alignItems: 'center' }}>
                                <SimpleLineIcons style={styles.icon__top}
                                    name="arrow-down"
                                    size={30} color="#ebdb34"
                                    onPress={() => bs.current.hide()} />
                            </View>
                            <Text
                                style={[styles.text__footer,
                                {
                                    fontSize: 15, textAlign: 'justify',
                                    fontFamily: 'popLight', lineHeight: 30
                                }
                                ]}
                            >
                                {getLangText('footer').text}
                            </Text>
                        </ScrollView>
                    </View>
                </SlidingUpPanel>
            </ImageBackground>

            <StatusBar style="auto" />
        </View>

    )
}


export default Accueil
const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: '15%'
    },
    slidingUpPanel: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 15
    },
    container: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1
    },

    container__logo: {
        width: "100%",
        height: "8%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },

    titre__ecran: {
        color: "black",
        fontFamily: "Poppins-Bold",
        fontSize: 15,
        marginTop: 65,
        //marginBottom: 2,
        color: "white",
        textAlign: "center"
    },
    container__menue: {
        width: "100%",
        height: height - 50 - height / 10,
        //flexDirection: "column",
        //justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    menue__item: {
        width: "80%",
        //height: "8%",
        backgroundColor: "#299bc4",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 8,
        borderRadius: 20,
        marginBottom: 20
    },
    icon__menue_item: {
        width: "10%",
    },
    text__menue_item: {
        width: "90%",
        color: "black",
        fontFamily: "Poppins-Bold",
        fontSize: 17,
        color: "white",
        textAlign: "center"
    },
    container__footer: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        position: "absolute",
        bottom: 0,
        height: '15%'
    },
    icon__footer: {
        fontWeight: "bold",
        fontFamily: "Poppins-Bold",
    },
    icon__top: {
        fontWeight: "bold",
        fontFamily: "Poppins-Bold",
        paddingTop:0.05*height,
        paddingBottom:0.05*height,
    },
    text__footer: {
        color: "white",
        fontFamily: "Poppins-Bold",
        fontSize: 18,
        textAlign: "center",
        //paddingBottom: 50,
    }
})
