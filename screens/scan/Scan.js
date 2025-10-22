import React, { Fragment, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import { BarCodeScanner } from 'expo-barcode-scanner';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import BluetothList from '../../components/bluetothList/BluetothList';
import Loading from '../../components/Loading';
import { functions } from '../../helpers/Constants';
const Scan = (props) => {
    const {navigation} = props

    const [hasPermission, setHasPermission] = useState(true);
    const [scanned, setScanned] = useState(false);
    const [themeListe, setThemeListe] = useState([])
    const [loading, setLoading] = useState(true)
    const [translate, setTranslate] = useState([])
    const [lang, setLang] = useState()
	const device = useCameraDevice("back");

	  const handleBarCodeScanned = (e) => {
    setScanned(true);
    const data= e
   //console.log(type, data)
    let verify = themeListe.filter(item => item.qrcLien.toString() === data.toString())

    if (verify.length > 0) {
        let value = themeListe.filter(item => item.qrcLien.toString() === data.toString())[0]
        navigation.navigate("Interet", {theme: value, themes: themeListe, titre: getThemeLangText(value).titre })
    }else{
      if (lang === 'fr') {
        functions.showAlert("Aucune unité ne correspond à ce QR-Code. Merci de votre compréhension");
      } else if (lang === 'es') {
        functions.showAlert("Ninguna unidad coincide con este código QR. Gracias por su comprensión");
      } else if (lang === 'cr') {
        functions.showAlert("Aucune inite pa koresponn ak QR-Code sa a. Mèsi pou konprann");
      } else {
        functions.showAlert("No unit matches this QR-Code. Thank you for your understanding");
      }
    }
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      console.log(`onCodeScanned `, codes);
      console.log(`onCodeScanned value`, codes[0].value);
      handleBarCodeScanned(codes[0].value);
    },
  });

    useEffect(() => {
        functions.getLang()
        .then(lang => {
            setLang(lang)
        })
    }, [])

    useEffect(() => {

        const getTranslate = async () => {
          let translate = await functions.getStore('@translate')
          translate = JSON.parse(translate)
          translate = translate.filter(item => item.type === "Interet")
          setTranslate(translate)
        }

        getTranslate()

    }, [])

    let mounted = true

    useEffect(() => {
        (async () => {
          //  const { status } = await BarCodeScanner.requestPermissionsAsync();
          // setHasPermission(status === 'granted');
        })();

        const getData = async () => {
            if (mounted) {
                let data = await functions.getStore('@interets')
                data = JSON.parse(data)
                data = data.map(item => item)

                setThemeListe(data)
                setLoading(false)
            }
        }

        getData()

        return () => mounted = false
    }, []);

	  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      console.log("Camera.requestCameraPermission ", permission);
      setHasPermission(permission === "granted");
    };

    requestCameraPermission();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (device === null || hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const getThemeTranslate = interet_id => translate.filter(item => item.interet_id === interet_id && (lang == "en" ? item.lang === undefined : item.lang == lang))

  const getThemeLangText = interet => lang === 'fr' ? interet : (translate.length > 0 ? (getThemeTranslate(interet.reference).length > 0 ? getThemeTranslate(interet.reference)[0] : interet) : interet)



    return loading ? <Loading /> :  (
        <View style={styles.container}>
              <BluetothList navigation={navigation}/>
            {
                themeListe.length > 0 &&
                <Fragment>
                   {/* <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
            />*/}
						<Camera
							codeScanner={codeScanner}
							style={styles.styleScanner}
							device={device}
							isActive={true}
						  />
                    {scanned &&
                        <View style={{width: "100%", height: 60, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop:20,}}>
                            <TouchableOpacity onPress={() => setScanned(false)}
                                style={{width:50, height: 50, flexDirection:"row", justifyContent:"center", alignItems:"center", backgroundColor: "#299bc4", borderRadius:50/2}}>
                                <Image
                                    source={require('../../assets/images/ic_refresh_24px.png')}
                                    style={{width: "40%", height: "40%" }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        </View>
                    }
                </Fragment>
            }
        </View>
    );
}

export default Scan

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
  styleScanner: {
    alignItems: "center",
    justifyContent: 'center',
    alignSelf: 'center',
    width: "100%",
    height: "100%",
  },
  camera: {
    width: "100%",
    height: 300,
  },

  imgBackground: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    flexDirection:"column",
    justifyContent: "space-between",
    alignItems: "center"
},
})
