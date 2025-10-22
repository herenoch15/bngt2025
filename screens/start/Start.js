import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Fragment, useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  DeviceEventEmitter,
} from "react-native";
import Beacons from '@hkpuits/react-native-beacons-manager';
import {
  BluetoothStateManager
} from "react-native-bluetooth-state-manager";
import { ProgressBar, Snackbar } from "react-native-paper";
import { useNetInfo } from "@react-native-community/netinfo";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, increment } from 'firebase/firestore';
import Loading from "../../components/Loading";
import { functions } from "../../helpers/Constants";
import {
  auth,
  firestore
} from "../../helpers/Firebase/firebase";
function memorySizeOf(obj) {
  var bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case "number":
          bytes += 8;
          break;
        case "string":
          bytes += obj.length * 2;
          break;
        case "boolean":
          bytes += 4;
          break;
        case "object":
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === "Object" || objClass === "Array") {
            for (var key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  }

  return sizeOf(obj);
}
function formatByteSize(bytes) {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " Ko";
  else if (bytes < 1073741824)
    return (bytes / 1048576).toFixed(1) / 0.125 + " Mo";
  else return (bytes / 1073741824).toFixed(1) + " Go";
}
const Start = (props) => {
  const netInfo = useNetInfo();
  const { navigation } = props;
  const [sizeBdd, setSizeBdd] = useState(0);
  const [lang, setLang] = useState("fr");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [progress, setProgress] = useState({
    pourcentage: 0,
    text: "Début du chargement des données",
  });
  const [messageText, setMessageText] = useState(
    "Pour utiliser pleinement votre application lors de votre randonnée, un premier téléchargement des données est obligatoire…"
  );
  const messageAlert = "Êtes-vous sur de vouloir télécharger les données?";
  //let mounted = true
  const [mounted, setMounted] = useState(true);
  const [activeDownload, setActiveDownload] = useState(false);

  firstDownload = async () => {
    try{
    console.log('FIRST');
    var taille = 0;
    var contenueTaille = 0;
    let collectLang = ["apropos", "categories", "sous-categories"];

    signInWithEmailAndPassword(auth,
        "cagntutilisateur@cagnt.fr",
        "cagntutilisateur@cagnt.fr"
      )
      .then(() => {
        collectLang.forEach(async (col) => {
          console.log("OKOK  TAFATAFA///");
          await getDoc(doc(firestore, col,"fr"))
            .then(async (resultCol) => {
              //console.log("OKOK ///" + JSON.stringify(resultCol));
              // taille.push(resultCol.data())
              console.log(
                "Taille FICHIER DOANLOAD::::::" + memorySizeOf(resultCol.data())
              );
              contenueTaille = memorySizeOf(resultCol.data());
            })
            .catch((e) => {
              console.error("langColl fire", e);
              console.log("asyncLang", e);
            });
          taille = taille + contenueTaille;
          setSizeBdd(formatByteSize(taille));

          console.log("Taille FICHIER DOANLOAD final::::::" + sizeBdd);
        });
      });
    }
    catch(error)
    {
      console.log('ERROR:'+ error);
    }
  };
  const checkStart = async () => {
    console.log("Taille FICHIER DOANLOAD 000");
    let starter = await functions.getStore(`@start`);
    starter = JSON.parse(starter);
    if (starter) {
      console.log("Taille FICHIER DOANLOAD 1111");
      setLoading(false);
    } else {
      //const taille =[]
      console.log("DEBUT DOWNLOAD");
      if (netInfo.isConnected && mounted) {
        let collectionName = [
            "accueil",
            "thematiques",
            "troncons",
            "unites",
            "translate",
            "communes",
            "interets",
          ],
          collectLang = ["apropos", "categories", "sous-categories"],
          tour = 0,
          collectText = "",
          tourLang = 0;

        signInWithEmailAndPassword(auth,
            "cagntutilisateur@cagnt.fr",
            "cagntutilisateur@cagnt.fr"
          )
          .then(() => {
            collectLang.forEach(async (col) => {
              console.log("::::::::: col colcol col col ::::::::");
              await getDoc(doc(firestore, col,"fr"))
                .then(async (resultCol) => {
                  console.log("::::::::: col colcol col col ::::::::"+ col);
                  //  taille.push(resultCol.data())

                  //console.log('Taille FICHIER DOANLOAD::::::'+  memorySizeOf(taille))
                  //  setSizeBdd(memorySizeOf(taille))
                  switch (col) {
                    case "apropos":
                      collectText = "d'a propos";
                      break;
                    case "categories":
                      collectText = "des catégories";
                      break;
                    default:
                      collectText = "des sous-catégories";
                      break;
                  }
                  setProgress({
                    pourcentage: (tourLang + tour) / 10,
                    text: `${
                      ((tourLang + tour) / 10) * 100
                    }% Chargement des données ${collectText}`,
                  });

                  try {
                     await functions.saveStore(`@${col}`, JSON.stringify(resultCol.data()))
                    tourLang++;
                    console.log("::::::::: tourLang ::::::::");
                    if (tourLang === collectLang.length) {
                      console.log("::::::::: collection.forEach  11::::::::");
                      collectionName.forEach(async (collect) => {
                        // console.log(
                        //   "::::::::: firestore ::::::::" +
                        //     JSON.stringify(collect)
                        // );
                        try {
                          const result = await getDocs(collection(firestore, collect));

                          let collectText = "";
                          switch (collect) {
                            case "accueil":
                              collectText = "textes de l'accueil";
                              break;
                            case "interets":
                              collectText = "centres d'intérêts";
                              break;
                            case "thematiques":
                              collectText = "thématiques";
                              break;
                            case "troncons":
                              collectText = "tronçons";
                              break;
                            case "unites":
                              collectText = "unités";
                              break;
                            case "translate":
                              collectText = "traductions";
                              break;
                            default:
                              collectText = "communes";
                              break;
                          }

                          setProgress({
                            pourcentage: (tourLang + tour) / 10,
                            text: `${((tourLang + tour) / 10) * 100}% Chargement des ${collectText}`,
                          });

                          const data = result.docs.map((doc) => doc.data());

                          await functions.saveStore(`@${collect}`, JSON.stringify(data));
                          tour++;

                          if (tour === collectionName.length) {
                            const update =
                              Platform.OS === "android"
                                ? { androidDownload: increment(1) }
                                : { iosDownload: increment(1) };

                            /*TODOawait updateDoc(
                              doc(firestore, "admin", "fsM4jY7WmTMxfUAA57K2cDMy1TM2"),
                              update
                            );*/

                            await functions.saveStore("@start", JSON.stringify(true));
                            await functions.saveStore("@updateDate", JSON.stringify(Date.now()));
                            await AsyncStorage.setItem("@fr", JSON.stringify(true));
                            await AsyncStorage.setItem("@lang", "fr");
                            await AsyncStorage.setItem("firstChagement", "true");

                            setVisible(false);
                            setLoading(false);
                          }
                        } catch (e) {
                          console.error("Erreur Firestore ou AsyncStorage :", e);
                        }
                      });
                    }
                  } catch (e) {
                    console.error("langColl", e);
                    console.log("asyncLang", e);
                  }
                })
                .catch((e) => {
                  console.error("langColl fire", e);
                  console.log("asyncLang", e);
                });
            });
          });
      } else {
        setVisible(true);
      }
    }
  };
 
    const getBeacons = async  () => {
        console.log('DEBUT BEBUT GET BEACONS::::')
        await requestLocationPermission()

        // Start detecting all iBeacons in the nearby
       console.log('Start detecting all iBeacons in the nearby')
       Beacons.init(); // to set the NotificationChannel, and enable background scanning
       Beacons.detectIBeacons();
       console.log('AFTER DETECT BT Beacons:::::: ')
        try {
            Beacons.setBackgroundScanPeriod(2000)
            Beacons.setForegroundScanPeriod(2000)
            Beacons.startRangingBeaconsInRegion('GEGION')
            console.log(`Region Beacons ranging started succesfully!`);
          } catch (err) {
            console.log(`Beacons ranging not started, error: ${error}`);
          }
        console.log('DEBUT Beacons:::::: 33')
}
  const afficherPage = async (lang) => {
    setLang(lang);
    let start = await AsyncStorage.getItem(`@${lang}`);
    await AsyncStorage.setItem("@lang", lang);
    start = JSON.parse(start);
    if (start) {
        await getBeacons()
       navigation.navigate("Accueil");

    } else {
      if (netInfo.isConnected) {
        setLoading(true);
        setMessageText(
          "Téléchargement des données de la langue choisie. Merci de patienter."
        );
        setProgress({
          pourcentage: 0,
          text: "Début du chargement des données",
        });
        //setChargement(true)
        let collectLang = ["apropos", "categories", "sous-categories"],
          tourLang = 0,
          collectText = "";

        collectLang.forEach((col) => {
          getDoc(doc(firestore, col,lang))
            .then(async (result) => {
              const jsonValue = JSON.stringify(result.data());
              switch (col) {
                case "apropos":
                  collectText = "d'a propos";
                  break;
                case "categories":
                  collectText = "des catégories";
                  break;
                default:
                  collectText = "des sous-catégories";
                  break;
              }
              setProgress({
                pourcentage: tourLang / 3,
                text: `${
                  Math.round(tourLang / 3) * 100
                }% Chargement des données ${collectText}`,
              });
              try {
                if (lang === "en") {
                  await functions.saveStore(`@${col}EN`, jsonValue);
                } else if (lang === "es") {
                  await functions.saveStore(`@${col}ES`, jsonValue);
                } else if (lang === "cr") {
                  await functions.saveStore(`@${col}CR`, jsonValue);
                } else {
                  await functions.saveStore(`@${col}`, jsonValue);
                }

                tourLang++;
                if (tourLang === collectLang.length) {
                  try {
                    await AsyncStorage.setItem(
                      `@${lang}`,
                      JSON.stringify(true)
                    );
                    //setLang(false)
                    setLoading(false);
                  //  Beacons.stop()
                  //  Platform.OS=='android'?  DeviceEventEmitter.removeAllListeners('beaconsDidRange') :  Beacons.BeaconsEventEmitter.removeAllListeners('beaconsDidRange')
                  await getBeacons()
                   navigation.navigate("Accueil");
                  } catch (e) {
                    console.log("async", e);
                  }
                }
              } catch (e) {
                console.log("asyncLang", e);
              }
            })
            .catch((e) => {
              console.log("firebase", col, e);
              let message;

              if (lang === "fr") {
                  message = "Vérifier votre connexion internet";
              } else if (lang === "es") {
                  message = "Verifica tu conexión a internet";
              } else if (lang === "cr") {
                  message = "Gadé koneksyon entènèt aw";
              } else {
                  message = "Check your internet connection"; // valeur par défaut
              }

              if (tourLang === collectLang.length) {
                functions.showAlert(message);
              }
            });
        });
      } else {
        let message;

          if (lang === "fr") {
              message = "Pour une première utilisation, nous avons besoin d'un accès à internet. Merci de vous connecter.";
          } else if (lang === "es") {
              message = "Para un primer uso, necesitamos acceso a internet. Por favor, conéctate.";
          } else if (lang === "cr") {
              message = "Pou premye itilizasyon, nou bezwen aksè a entènèt. Tanpri, konekte.";
          } else {
              message = "For a first use, we need internet access. Please connect to the internet."; // valeur par défaut
          }

        functions.showAlert(message);
      }
    }
  };

  async function getIsFirstLaunch() {
     try{
      await Beacons.stop()
      Platform.OS=='android'?  DeviceEventEmitter.removeAllListeners('beaconsDidRange') :  Beacons.BeaconsEventEmitter.removeAllListeners('beaconsDidRange')
    }
    catch {}
    const first = await AsyncStorage.getItem("firstChagement");
    if (first) {
      setActiveDownload(true);
    }
  }

  useEffect(() => {
    enableBluetooth()
    getIsFirstLaunch();
  }, []);

  useEffect(() => {
    console.log("DEBIT START");
    const fetchData = async () => {
      const data = await firstDownload();
      setIsFirstLaunch(false);
    };

    if (activeDownload) {
      fetchData()
        .then(async () => {
          console.log("start checkStart");
          await checkStart();
        })
        .catch(console.error);
    }
    /*  setTimeout( async() => {
            let first = await  AsyncStorage.getItem('firstChagement')
            firstDownload()
           if(first!=null) {
            console.log('false')

            console.log('Taille FICHIER DOANLOAD')

           // checkStart()
            }else {
                console.log('TRUE')

            }
        }, 500);*/
  }, [netInfo.isConnected, activeDownload]);
    const enableBluetooth = () => {
      BluetoothStateManager.getState().then((state) => {
        if (state !== 'PoweredOn') {
          BluetoothStateManager.requestToEnable()
            .then(() => {
              console.log('Bluetooth enabled');
            })
            .catch((err) => {
              console.log('User refused to enable Bluetooth', err);
            });
        } else {
          console.log('Bluetooth is already enabled');
        }
      });
    };
      const requestLocationPermission = async () => {
          if (Platform.OS === 'ios') {
            return true
          }
          if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
            const apiLevel = parseInt(Platform.Version.toString(), 10)
  
            if (apiLevel < 31) {
              const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
              return granted === PermissionsAndroid.RESULTS.GRANTED
            }
            if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
              const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
              ])
  
              return (
                result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
              )
            }
          }
         
                  return true;
        }
    const asyncBlueThouth = async () => {
            console.log("APPPP////////////")
            await requestLocationPermission()
            // Tells the library to detect iBeacons
            Beacons.init(); // to set the NotificationChannel, and enable background scanning
            Beacons.detectIBeacons();
            Beacons.setBackgroundScanPeriod(2000)
            Beacons.setForegroundScanPeriod(2000)
            console.log("Start detecting all iBeacons in the nearby")
            // Start detecting all iBeacons in the nearby
            try {
                await Beacons.startRangingBeaconsInRegion('REGION1')
                console.log(`Beacons ranging started succesfully!`);
            } catch (error) {
                console.log(`Beacons ranging not started, error: ${error}`);
            }

            // Print a log of the detected iBeacons (1 per second)
            DeviceEventEmitter.addListener('beaconsDidRange', async (data) => {
                try {
                    console.log('LIST BEACON SCAN'+ JSON.stringify(data.beacons))
                //    await AsyncStorage.setItem("@listBeacons", JSON.stringify(data.beacons));
                } catch (error) {
                    
                }
                   
            })
    }
  return loading ? (
    <Fragment>
      <Loading />
      {/* <Text style={[styles.titre__info_choix, {position: 'absolute'}]}>Chargement des ressources...</Text> */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          left: 0,
          right: 0,
          position: "absolute",
          bottom: "10%",
        }}
      >
        <Text
          style={[
            styles.titre__info_choix,
            { textAlign: "center", fontSize: 11 },
          ]}
        >
          {messageText}
        </Text>
        {sizeBdd != 0 ? (
          <Text style={styles.taille}>
            Taille de fichier à télécharger: {sizeBdd}
          </Text>
        ) : null}
        {!activeDownload ? (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Information",
                messageAlert,
                [
                  {
                    text: "Oui",
                    onPress: async () => {
                      await setActiveDownload(true);
                      return false;
                    },
                  },
                  {
                    text: "Non",
                    onPress: () => {},
                  },
                ],
                { cancelable: false }
              );
            }}
            style={styles.btnAccesFirst}
          >
            <Text style={styles.textbtnAccesFirst}>Téléchargement</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={{ position: "absolute", bottom: 30, width: "100%" }}>
        <Text
          style={[
            styles.titre__info_choix,
            { textAlign: "center", fontSize: 11 },
          ]}
        >
          {progress.text}
        </Text>
        <Text></Text>
        <ProgressBar
          progress={parseFloat(progress.pourcentage)}
          color="#2ca331"
          style={{ width: "100%" }}
        />
      </View>
    </Fragment>
  ) : (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: "Fermer",
          onPress: () => setVisible(false),
        }}
      >
        Pour une première utilisation nous avons besoin d'un accès à internet.
      </Snackbar>

      <View style={styles.logo__content}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 270, height: 270 }}
        />
      </View>

      <View style={styles.langue__contenu}>
        {/* <Text style={styles.titre__info_choix}>Sélectionnez Votre Langue</Text> */}
        <View style={styles.choix__langue}>
          <TouchableOpacity
            style={styles.bloc__drapeau}
            onPress={() => afficherPage("fr")}
          >
            <Image
              source={require("../../assets/images/francais.png")}
              style={{
                marginRight: 10,
                borderRadius: 20,
                width: 40,
                height: 40,
              }}
            />
            <Text style={styles.titre__langue}>Français</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bloc__drapeau}
            onPress={() => afficherPage("en")}
          >
            <Image
              source={require("../../assets/images/anglais.png")}
              style={{
                marginRight: 10,
                borderRadius: 20,
                width: 40,
                height: 40,
              }}
            />
            <Text style={styles.titre__langue}>English</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.choix__langue}>
          <TouchableOpacity
            style={styles.bloc__drapeau}
            onPress={() => afficherPage("es")}
          >
            <Image
              source={require("../../assets/images/espagnol.png")}
              style={{
                marginRight: 10,
                borderRadius: 20,
                width: 40,
                height: 40,
              }}
            />
            <Text style={styles.titre__langue}>Español</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bloc__drapeau}
            onPress={() => afficherPage("cr")}
          >
            <Image
              source={require("../../assets/images/guadeloupe.png")}
              style={{
                marginRight: 10,
                borderRadius: 20,
                width: 40,
                height: 40,
              }}
            />
            <Text style={styles.titre__langue}>Kreyòl</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/*const mapStateProps = (state) => {
    return {
        currentPopupBT: state.Poi.currentPopupBT,
        listPoi: state.Poi.listPoi
    }
  }
export default connect(mapStateProps)(Start)*/
export default Start
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  btnAccesFirst: {
    backgroundColor: "#2ca331",
    borderRadius: 33,
    height: 38,
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    marginTop: 10,
  },
  textbtnAccesFirst: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logo__content: {
    width: "80%",
    height: "60%",
    paddingTop: 150,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  langue__contenu: {
    width: "100%",
    height: "40%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: "90%",
    height: "100%",
  },

  loader__content: {
    width: "100%",
    height: "40%",
  },

  choix__langue: {
    width: "90%",
    height: "25%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2ca331",
    borderRadius: 35,
    marginTop: 10,
  },

  bloc__drapeau: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: "100%",
  },

  bloc__titre__langue: {
    width: "70%",
    height: "100%",
  },

  titre__info_choix: {
    color: "#637899",
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
  taille: {
    color: "#000000",
    fontFamily: "Poppins-Bold",
    fontSize: 10,
  },

  titre__langue: {
    color: "white",
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
});
