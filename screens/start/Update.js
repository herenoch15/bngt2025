import { useNetInfo } from "@react-native-community/netinfo";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, Timestamp } from 'firebase/firestore';
import React, { Fragment, useEffect, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loading from '../../components/Loading';
import { functions } from '../../helpers/Constants';
import { firestore } from '../../helpers/Firebase/firebase';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';

const Update = props => {
    const netInfo = useNetInfo();

    const {lang} = props.route.params

    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState({
        show: false,
        pourcentage: 0,
        text: 'Début du chargement des données',
    })
    const [messageText, setMessageText] = useState(
        lang === 'fr' ? "Vérification de la disponibilité des mises à jour" : lang === 'es' ? "Verificación de la disponibilidad de actualizaciones" : lang === 'cr' ? "Verifye disponiblite dènye mizajou" : 'Checking the availability of updates'
    )
    const [afficheUpdate, setAfficheUpdate] = useState(false)

    let mounted = true

    useEffect(() => {
        const schowUpdate = async () => {
            if (netInfo.isConnected && mounted) {
                setLoading(true)
                console.log('UPLOAD:::')
                let updateDate = await functions.getStore(`@updateDate`)
                updateDate= updateDate ?? 0
                    await onSnapshot(doc(firestore, "admin", "fsM4jY7WmTMxfUAA57K2cDMy1TM2"), async adminCol => {
                        let admin = adminCol.data()
                        if (admin) {
                            let update = new Timestamp(admin.lastVersion.seconds, admin.lastVersion.nanoseconds)
                            updateDate = parseInt(updateDate)
                            console.log('UPDATE:::'+update.toMillis()+'/'+updateDate)

                            setAfficheUpdate(update.toMillis() - updateDate > 0)

                            let state = await AsyncStorage.getItem('state')
                            if (state) {
                                console.log("state"+state)
                                state = JSON.parse(state)

                                if (!state.commit) {
                                    if (state.result.length > 0) {
                                        let addItem = [],
                                            asAdd = state.result.map((item, i) => {
                                                return {
                                                    indice : i,
                                                    val: item
                                                }
                                            }).filter(item => !item.val.add)

                                            //console.log(asAdd)

                                            //state.result[asAdd[0].indice].add = true
                                            //console.log(state.result)

                                        if (asAdd.length > 0) {
                                            asAdd.forEach(async itemState => {
                                                state.result[itemState.indice].add = true

                                                let data = {
                                                    ...itemState.val,
                                                    add: true
                                                }
                                                console.log(itemState)

                                                await addDoc(collection(firestore, 'statePoi'), data)
                                                .then(async() => {
                                                    addItem.push(data)
                                                    if (addItem.length === asAdd.length) {
                                                        let final = {
                                                            result: state.result,
                                                            commit: true
                                                        }
                                                        await AsyncStorage.setItem('state', JSON.stringify(final))
                                                        setLoading(false)
                                                    }
                                                })
                                            })
                                        }else{
                                            setLoading(false)
                                        }
                                    }
                                }else{
                                    setLoading(false)
                                }
                            }else{
                                setLoading(false)
                            }
                        }
                    })

            }else{
                setLoading(false)
            }
        }

        schowUpdate()
        return () => mounted = false
    }, [netInfo.isConnected])

    const updateData = async () => {
        if (netInfo.isConnected) {
            setLoading(true)
            setMessageText(lang === "fr" ? "Téléchargement des nouvelles données de l'application. Merci de patienter." : "Download new application data. Please wait.")
            setProgress({
                show: true,
                pourcentage: 0,
                text: lang === "fr" ? 'Début du chargement des données'
                : lang === "es" ? 'Inicio de la carga de datos'
                : lang === "cr" ? 'Kòmanseman mizajou'
                : 'Start of data loading',
            })
            let collectLang = ['apropos', 'categories', 'sous-categories'],
                collectionName = ['accueil', 'thematiques', 'troncons', 'unites', 'translate', 'communes', 'interets'],
                tour = 0, tourLang = 0, collectText = ''

            collectLang.forEach(colLang => {
                getDoc(doc(firestore, colLang,lang))
                .then(async (resultLang) => {
                    switch(colLang) {
                      case 'apropos' :
                          collectText = lang === 'fr' ? "d'à propos"
                                      : lang === 'es' ? "de acerca de"
                                      : lang === 'cr' ? "konsènan"
                                      : 'by the way'
                          break;
                      case 'categories' :
                          collectText = lang === 'fr' ? "des catégories"
                                      : lang === 'es' ? "de categorías"
                                      : lang === 'cr' ? "kategori"
                                      : "from categories"
                          break;
                      default :
                          collectText = lang === 'fr' ? "des sous-catégories"
                                      : lang === 'es' ? "de subcategorías"
                                      : lang === 'cr' ? "sou-kategori"
                                      : "from subcategories"
                            break
                    }
                    setProgress({
                        show: true,
                        pourcentage: (tourLang+tour)/10,
                        text: `${((tourLang+tour)/10)*100}% ${lang === 'fr' ? 'Chargement des données'
                                                              : lang === 'es' ? 'Cargando datos'
                                                              : lang === 'cr' ? 'Mizajou'
                                                              : 'Loading data'} ${collectText}`
                    })

                    try {
                        await functions.saveStore(`@${colLang}`, JSON.stringify(resultLang.data()))
                        if (lang === 'en') {
                            await functions.saveStore(`@${colLang}EN`, JSON.stringify(resultLang.data()))
                        }
                        tourLang++
                        if (tourLang === collectLang.length) {
                            collectionName.forEach(collect => {
                                getDocs(collection(firestore, collect))
                                .then(async (result) => {
                                    switch(collect) {
                                      case 'accueil' :
                                            collectText = lang === 'fr' ? "textes de l'accueil"
                                                        : lang === 'es' ? "textos de inicio"
                                                        : lang === 'cr' ? "tèks lakay"
                                                        : 'home texts';
                                            break;
                                        case 'interets' :
                                            collectText = lang === 'fr' ? "centres d'intérêts"
                                                        : lang === 'es' ? "centros de interés"
                                                        : lang === 'cr' ? "sant enterè"
                                                        : "centers of interest";
                                            break;
                                        case 'thematiques' :
                                            collectText = lang === 'fr' ? "thématiques"
                                                        : lang === 'es' ? "temáticas"
                                                        : lang === 'cr' ? "tematik"
                                                        : "themes";
                                            break;
                                        case 'troncons' :
                                            collectText = lang === 'fr' ? "tronçons"
                                                        : lang === 'es' ? "secciones"
                                                        : lang === 'cr' ? "seksyon"
                                                        : "sections";
                                            break;
                                        case 'unites' :
                                            collectText = lang === 'fr' ? "unités"
                                                        : lang === 'es' ? "unidades"
                                                        : lang === 'cr' ? "inite"
                                                        : "units";
                                            break;
                                        case 'translate' :
                                            collectText = lang === 'fr' ? "traductions"
                                                        : lang === 'es' ? "traducciones"
                                                        : lang === 'cr' ? "tradiksyon"
                                                        : "translations";
                                            break;
                                        default :
                                            collectText = lang === 'fr' ? "communes"
                                                        : lang === 'es' ? "municipios"
                                                        : lang === 'cr' ? "komin"
                                                        : "communes"
                                            break
                                    }
                                    setProgress({
                                        show: true,
                                        pourcentage: (tourLang+tour)/10,
                                        text: `${((tourLang+tour)/10)*100}% ${lang === 'fr' ? 'Chargement des '
                                                                              : lang === 'es' ? 'Cargando '
                                                                              : lang === 'cr' ? 'Mizajou '
                                                                              : 'Loading '} ${collectText}`
                                    })

                                    let data = result.docs.map(item => item.data())

                                    try {
                                        await functions.saveStore(`@${collect}`, JSON.stringify(data))
                                        tour++
                                        if (tour === collectionName.length) {
                                            await functions.saveStore(`@updateDate`, JSON.stringify(Date.now()))
                                            setAfficheUpdate(false)
                                            setLoading(false)
                                            functions.showAlert(lang === 'fr' ? "Mise à jour réussie"
                                                                : lang === 'es' ? "Actualización exitosa"
                                                                : lang === 'cr' ? "Mizajou reyisi"
                                                                : "Successful upgrade")
                                        }
                                    }catch (e) {
                                        //console.log('async', e)
                                    }
                                }).catch(e => {
                                    //console.log('firebase', collect, e)
                                    if (tour === collectionName.length) {
                                        functions.showAlert(
                                          lang === 'fr' ? "Vérifier votre connexion internet"
                                        : lang === 'es' ? "Verifique su conexión a internet"
                                        : lang === 'cr' ? "Pwan gad koneksyon entènèt"
                                        : "Check your internet connection"
                                        )
                                    }
                                })
                            })
                        }
                    }catch (e) {
                        //console.log('asyncLang', e)
                    }
                }).catch(e => {
                    //console.log('firebase', col, e)
                    if (tourLang === collectLang.length && tour === collectionName.length) {
                        functions.showAlert(
                          lang === 'fr' ? "Vérifier votre connexion internet"
                        : lang === 'es' ? "Verifique su conexión a internet"
                        : lang === 'cr' ? "Pwan gad koneksyon entènèt la"
                        : "Check your internet connection"
                        )
                    }
                })
            })
        }else{
            functions.showAlert(
              lang === 'fr' ? "Impossible de mettre à jour. Merci de vérifier votre connexion internet"
            : lang === 'es' ? "No se puede actualizar. Verifique su conexión a internet"
            : lang === 'cr' ? "Enposib fè mizajou. Pwan gad koneksyon entènèt la" 
            : "Unable to update. Please check your internet connection"
            )
        }
    }

    return loading ?
        <Fragment>
            <Loading/>
            <View style={{ justifyContent: 'center', alignItems: 'center', bottom: '10%', }}>
                <Text style={[styles.titre__info_choix, {textAlign: 'center', fontSize: 11}]}>
                    {messageText}
                </Text>
            </View>
            {
                progress.show &&
                <View style={{ position: 'absolute', bottom: 30, width: '100%' }}>
                    <Text style={[styles.titre__info_choix, { textAlign: 'center', fontSize: 11}]}>
                        {progress.text}
                    </Text>
                    <ProgressBar progress={parseFloat(progress.pourcentage)} color="#2ca331" style={{ width: '100%'}} />
                </View>
            }
        </Fragment>

    : (
        <View style={styles.container}>

            <StatusBar style="auto" />

            <View style={styles.logo__content}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={{width: 270, height: 270 }}
                />
            </View>

            <View style={styles.langue__contenu}>

                {
                    afficheUpdate ?
                    <TouchableOpacity onPress={() => updateData()}
                        style={{
                            justifyContent: 'center', alignItems: 'center', flexDirection: 'row',
                             padding: 8, height: '20%', width: '50%',
                            borderWidth: 1,  borderBottomWidth: 5, borderRadius: 25,
                            backgroundColor: "#2ca331",  borderColor: '#207324',
                        }}
                    >
                        <MaterialIcons name="update" size={18} color="#ffffff" />
                        <Text style={{ color: '#ffffff', fontFamily: 'Poppins-Bold', fontSize: 13, marginLeft: 5 }}>{lang === 'fr' ? 'Mise à jour' : 'Update'}</Text>
                    </TouchableOpacity>
                    :
                    <Text style={styles.titre__info_choix}>
                        {lang === 'fr' ? 'Votre version est à jour.'
                        : lang === 'es' ? 'Su versión está actualizada.'
                        : lang === 'cr' ? 'Vèsyon la ajou.'
                        : 'Your version is up to date.'}
                    </Text>
                }
            </View>
      </View>
    )
}

export default Update

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },

      logo__content : {
        width : "80%",
        height : "60%",
        paddingTop : 150,
        flexDirection : "column",
        justifyContent : "flex-end",
        alignItems : "center",
      },

      langue__contenu : {
        width : "100%",
        height : "40%",
        flexDirection : "column",
        justifyContent : "center",
        alignItems : "center",
      },

      logo: {
        width: "90%",
        height: "100%"
      },

    titre__info_choix : {
      color : "#637899",
      fontFamily : "Poppins-Bold",
      fontSize: 15,
    },
})
