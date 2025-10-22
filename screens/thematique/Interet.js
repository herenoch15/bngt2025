import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image, Linking,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet, Text,
    TouchableOpacity,
    View
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';
//import { Audio } from 'expo-av';
import Autolink from 'react-native-autolink';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Loading from '../../components/Loading';
import BluetothList from '../../components/bluetothList/BluetothList';
import { functions } from '../../helpers/Constants';
const { height, width } = Dimensions.get('window')

const Interet = (props) => {
    const { navigation, route } = props
    const { theme, titre } = route.params
    const bs = useRef(null)

    const [curImg, setCurImg] = useState(false)
    const [interets, setInterets] = useState([])
    const [interetSave, setInteretSave] = useState([])
    const [loading, setLoading] = useState(true)
    const [commune, setCommune] = useState([])
    const [img, setImg] = useState(false)
    const [lang, setLang] = useState('fr')
    const [translate, setTranslate] = useState([])
    const [modal, setModal] = useState(false)
    const [modalLSF, setModalLSF] = useState(false)
    const [modalType, setModalType] = useState("autre")
    const [lienVideo, setLienVideo] = useState("")
    const [lienVideoLSF, setLienVideoLSF] = useState("")
    const [content, setContent] = useState({
        titre: '',
        description: '',
    })
    const [modeText, setModeText] = useState([])
    const [hasAudioPermission, setHasAudioPermission] = useState(false)
    const [playAudio, setPlayAudio] = useState(true)
    const [sound, setSound] = useState(null)
    const [videoFile, setVideoFile] = useState(null)
    const [showControls, setShowControls] = useState(false)
    const [isReady, setIsReady] = useState(false)

    const statePoi = async () => {
        let state = await AsyncStorage.getItem('state')
        let toDate = new Date()
        let result = [], commit = true
        if (state) {
            state = JSON.parse(state)
            result = state.result
            commit = state.commit
            let forToDay = state.result.filter(item => {
                let date = new Date(item.day)
                return toDate.getFullYear() === date.getFullYear() &&
                    toDate.getMonth() === date.getMonth() &&
                    toDate.getDate() === date.getDate() &&
                    item.poi === theme.identifiant
            })

            if (forToDay.length === 0) {
                result.push({
                    poi: theme.identifiant,
                    day: new Date(),
                    paltform: Platform.OS,
                    add: false
                })
                commit = false
            }
        } else {
            result.push({
                poi: theme.identifiant,
                day: new Date(),
                paltform: Platform.OS,
                add: false
            })
            commit = false
        }
        let final = {
            result,
            commit
        }
        await AsyncStorage.setItem('state', JSON.stringify(final))
        //await AsyncStorage.removeItem('state')
    }

    useEffect(() => {
        functions.getLang()
            .then(async lang => {
               // const audioStatus = await Audio.requestPermissionsAsync()
               // setHasAudioPermission(audioStatus.status === 'granted')
                statePoi()
                setLang(lang)
            })
    }, [])

    useEffect(() => {
        const preloadImages = async () => {
            await Promise.all(
                modeText.filter(uri => uri != '' && uri !== undefined).map(uri => Image.prefetch(uri))
            );
            setIsReady(true);
        };
        preloadImages();
    }, [modeText])

    /*useEffect(() => {

        const getTranslate = async () => {
            let trans = await functions.getStore('@translate')
                trans = JSON.parse(trans)

                setTranslate(trans.filter(item => item.type === "Interet"))
        }

        getTranslate()

    }, [])*/

    const contenus = {
        audios: [
            { id: 6, file: require('../../assets/contenu/audios/6-Podcast-Port-louis-offline.mp3') },
            { id: 69, file: require('../../assets/contenu/audios/69-Postcast-Anse-Bertrand-offline.mp3') }
        ],
        videos: [
            {id: 74, file: require('../../assets/contenu/videos/74-BNGT-Film-2-POINTE-ANTIGUE-ST-offline.mp4')},
            {id: 514, file: require('../../assets/contenu/videos/514-BNGT-Film-1-La-Mahaudiere-ST-offline.mp4')},
            {id: 457, file: require('../../assets/contenu/videos/457-BNGT-Film-3-Pointe-de-la-Grande-Vigie-ST-offline.mp4')},
            {id: 262, file: require('../../assets/contenu/videos/262-Le-Fromager-ST-offline.mp4')},
            {id: 356, file: require('../../assets/contenu/videos/356-Les-Ti-mons-et-le-tou-a-Man-Koko-ST-offline.mp4')},
            {id: 428, file: require('../../assets/contenu/videos/428-Le-vent-le-sable-et-le-bambou-ST-offline.mp4')},
            {id: 196, file: require('../../assets/contenu/videos/196-BNGT-Prison-Anse-Bertrand-1-offline.mp4')},
            {id: 522, file: require('../../assets/contenu/videos/522-BNGT-Prison-Anse-Bertrand-2-offline.mp4')}
        ]
    }

    let mounted = true

    useEffect(() => {
        const getData = async () => {
            if (lang !== '' && mounted) {
                let interets = await functions.getStore('@interets'),
                    communes = await functions.getStore('@communes'), data = [], priorite = [], sansPriorite = []

                interets = JSON.parse(interets)

                interets.filter(item => item.titre !== theme.titre)
                    .filter(item => item.unite === theme.unite)
                    .forEach(interet => {
                        if (interet.priorite !== null && interet.priorite != '') {
                            priorite.push(interet)
                        } else {
                            sansPriorite.push(interet)
                        }
                    })

                communes = JSON.parse(communes)

                priorite = priorite.sort((a, b) => a.priorite - b.priorite)
                sansPriorite = sansPriorite.sort((a, b) => a.identifiant - b.identifiant)
                data = priorite.sort((a, b) => a.titre < b.titre ? -1 : 1)

                setInteretSave(interets)
                let translate = await functions.getStore('@translate')

                translate = JSON.parse(translate)
                translate = translate.filter(item => item.type === "Interet" && (lang == "en" ? item.lang === undefined : item.lang == lang))
                setTranslate(translate)

                if (lang !== 'fr' && translate.length > 0) {
                    data.forEach((item, i) => {
                        let valEn = translate.filter(trans => trans.interet_id === item.reference)
                        if (valEn.length > 0) {
                            data[i] = {
                                ...data[i],
                                ...valEn[0]
                            }
                        }
                    })
                }
                data.sort((a, b) => a.titre < b.titre ? -1 : 1)

                //data = priorite.sort((a, b) => a.titre < b.titre ? -1 : 1) //.filter(item => item.titre !== theme.titre)

                setCommune(communes)
                navigation.setOptions({
                    title: titre,
                });
                setInterets(data)
                setLoading(false)
            }

        }
        getData()
        return () => mounted = false
    }, [lang])

    // useEffect(() => {
    //     navigation.setOptions({
    //         title: getThemeLangText(theme).titre,
    //     });
    // }, [theme])

    useEffect(() => {
        if (bs.current !== null) {
            bs.current.hide()
        }
    }, [loading])

    const getThemeTranslate = interet_id => translate.filter(item => item.interet_id === interet_id && (lang == "en" ? item.lang === undefined : item.lang == lang))

    const getThemeLangText = interet => lang === 'fr' ? interet : (translate.length > 0 ? (getThemeTranslate(interet.reference).length > 0 ? getThemeTranslate(interet.reference)[0] : interet) : interet)

    const isNotNullOrEmpty = string => (string != "" && string !== undefined) ? true : false;

    const images = [require('../../assets/images/reeg.png'), require('../../assets/images/fqf.png'), require('../../assets/images/ssggs.png')];

    const goToLink = link => link !== '' && Linking.openURL(link)

    const openCallPhone = phone => Linking.openURL(Platform.OS === 'android' ? 'tel:' + phone : 'telprompt:' + phone)

    const googleMapOpenUrl = ({ latitude, longitude, label }) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${latitude},${longitude}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        return url;
    }

    const playSound = async (file) => {
        if (hasAudioPermission) {
          //DELETE  const { sound } = await Audio.Sound.createAsync(file);
           // await sound.playAsync()
          //  setSound(sound)
          //  setPlayAudio(!playAudio)
        } else {
            functions.showAlert(lang === 'fr' ? "Veuillez l'accès à l'audio. Merci pour votre compréhension." :
                             lang === 'es' ? "Por favor, acceda al audio. Gracias por su comprensión." :
                             lang === 'cr' ? "Souplé, lésé nou jwenn aksè a odyo a. Mèsi pou konprann." :
                             "Please access the audio. Thank you for your understanding.")
        }
    }

    const stopSound = async () => {
        await sound.stopAsync();
        setSound(null)
        setPlayAudio(!playAudio)
    }

    const setModalVideo = (lienLSF, lien) => {
        if(lienLSF != "" && lienLSF !== undefined && lienLSF != null)
        {
          setLienVideo(lien)
          setLienVideoLSF(lienLSF)
          setModalLSF(true)
        }
        else
        {
          goToLink(lien)
        }
    }

    const handleShowControls = () => {
        setShowControls(true);
    };

    return loading ? <Loading /> : (
        <SafeAreaView>
            <BluetothList navigation={navigation}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Modal animationType="slide" transparent={true} visible={modal}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {
                                modalType === "autre" ?
                                    <Fragment>
                                        {
                                            img ?
                                                <Image
                                                    //source={require('../../assets/images/handicap.jpg')}
                                                    source={{ uri: img }}
                                                    style={{ width: "60%", height: "60%", marginBottom: 5 }}
                                                    resizeMode="contain"
                                                />
                                                :
                                                <Fragment>
                                                    {
                                                        content.titre !== '' ?
                                                            <Fragment>
                                                                <View style={{ backgroundColor: '#de382f', width: '95%', alignItems: 'center', margin: 3 }}>
                                                                    <Text style={{ color: 'white', padding: 8, fontFamily: 'Poppins-Bold' }}>
                                                                        {content.titre}
                                                                    </Text>
                                                                </View>

                                                                <View style={{ height: "75%", width: "92%" }}>
                                                                    <ScrollView showsVerticalScrollIndicator={false}>
                                                                      <Autolink
                                                                      text={content.description}
                                                                      renderText={(text) => <Text style={{ fontSize: 13, padding: 8, fontFamily: 'popLight', textAlign: 'justify', marginBottom: 100}}>
                                                                          {text}
                                                                      </Text>}
                                                                      linkStyle={{ color: '#25a1f1', fontStyle: 'italic' }} />
                                                                    </ScrollView>
                                                                </View>
                                                            </Fragment>
                                                            :
                                                            isReady ? <Swiper autoplay={true} activeDotColor="#de382f">
                                                                {
                                                                    modeText.filter(uri => uri != '' && uri !== undefined).map((img, i) => (
                                                                        <Image
                                                                            key={i}
                                                                            source={{ uri: img }}
                                                                            style={{ width: "100%", height: "100%" }}
                                                                            resizeMode="contain"
                                                                        />
                                                                    ))
                                                                }
                                                            </Swiper>
                                                            :
                                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                                <ActivityIndicator size="large" color="#de382f" />
                                                            </View>
                                                    }
                                                </Fragment>
                                        }
                                    </Fragment>
                                    :
                                    <Video
                                        source={videoFile}
                                        style={{ width: '100%', aspectRatio: 16 / 9 }}
                                        controls={showControls}
                                        onBuffer={() => handleShowControls()}
                                    />
                            }

                            <Pressable style={[styles.bouton__afficher__parcours, { height: '5%', position: "absolute", bottom: 0, }]} onPress={() => {
                                setModal(!modal)
                                setModalType("autre")
                                setContent({ titre: '', description: '' })
                                setModeText([])
                                setImg(false)
                            }}>
                                <Text style={styles.text__bouton__afficher__parcours}>
                                    {lang === 'fr' ? 'Fermer' :
                              lang === 'es' ? 'Cerrar' :
                              lang === 'cr' ? 'Kité' :
                              'Close'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="slide" transparent={true} visible={modalLSF}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                        <TouchableOpacity
                          style={styles.bloc__drapeau}
                          onPress={() => goToLink(lienVideo)}
                        >
                            {
                              lang == "cr" ?
                              <Image
                                source={require("../../assets/images/guadeloupe.png")}
                                style={{
                                  marginTop: 20,
                                  width: 225,
                                  height: 150,
                                }}
                              /> :
                              lang == "en" ?
                              <Image
                                source={require("../../assets/images/anglais.png")}
                                style={{
                                  marginTop: 20,
                                  width: 225,
                                  height: 150,
                                }}
                              /> :
                              lang == "es" ?
                              <Image
                                source={require("../../assets/images/espagnol.png")}
                                style={{
                                  marginTop: 20,
                                  width: 225,
                                  height: 150,
                                }}
                              /> :
                              <Image
                                source={require("../../assets/images/francais.png")}
                                style={{
                                  marginTop: 20,
                                  width: 225,
                                  height: 150,
                                }}
                              />
                            }
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.bloc__drapeau}
                              onPress={() => goToLink(lienVideoLSF)}
                            >
                                  <Image
                                    source={require("../../assets/images/lsf.png")}
                                    style={{
                                      marginTop: 20,
                                      width: 225,
                                      height: 150,
                                    }}
                                  />
                                </TouchableOpacity>

                            <Pressable style={[styles.bouton__afficher__parcours, { height: '5%', position: "absolute", bottom: '10%', }]} onPress={() => {
                                setModalLSF(!modalLSF)
                            }}>
                                <Text style={styles.text__bouton__afficher__parcours}>
                                    {lang === 'fr' ? 'Fermer' :
                              lang === 'es' ? 'Cerrar' :
                              lang === 'cr' ? 'Kité' :
                              'Close'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
                <View style={styles.container}>

                    <View style={styles.bloc__distance_lieu}>
                        <View style={styles.bloc__distance}>
                            {/* <Fontisto style={styles.icon__titre__etape} name="map-marker-alt" size={15} color="#de382f" />
                        <Text>4,656 Km</Text> */}
                        </View>
                        {
                            commune.filter(item => item.uid === theme.commune).length > 0 &&
                            <View style={styles.bloc__lieu}>
                                <Text>{commune.filter(item => item.uid === theme.commune)[0].libelle}</Text>
                            </View>
                        }
                    </View>

                    <View style={styles.bloc__image_thematique}>
                        <TouchableOpacity
                            onPress={() => { setCurImg(theme.image ? theme.image.toString() : false); bs.current.show() }}
                        >
                            <Image
                                source={theme.image ? { uri: theme.image.toString() } : require('../../assets/interet.png')}
                                style={{ borderRadius: 25, width: "100%", height: "100%" }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bloc__bouton__action}>

                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <TouchableOpacity style={styles.bouton__action} onPress={() => { Linking.openURL(googleMapOpenUrl({ latitude: theme.latitude, longitude: theme.longitude, label: theme.titre })) }}>
                                <Image source={require('../../assets/images/random.png')} />
                            </TouchableOpacity>
                            <Text style={{ textAlign: 'center', fontFamily: "Poppins-Bold", }}>
                                {lang === 'fr' ? 'Y aller' :
                                lang === 'es' ? 'Ir' :
                                lang === 'cr' ? 'An nou ay' :
                                'Go'}
                            </Text>
                        </View>

                        {
                            theme.liens.url !== "" &&
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.bouton__action} onPress={() => goToLink(theme.liens.url)}>
                                    <FontAwesome style={styles.icon__titre__etape} name="globe" size={35} color="#fff" />
                                </TouchableOpacity>
                                <Text style={{ textAlign: 'center', fontFamily: "Poppins-Bold", }}>
                                    {lang === 'fr' ? 'Site web' :
                                     lang === 'es' ? 'Sitio web' :
                                     lang === 'cr' ? 'Sit entènèt' :
                                     'Website'}
                                </Text>
                            </View>
                        }

                        {
                            theme.liens.telephone !== "" &&
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <TouchableOpacity style={styles.bouton__action} onPress={() => openCallPhone(theme.liens.telephone)}>
                                    <FontAwesome style={styles.icon__titre__etape} name="phone" size={35} color="#fff" />
                                </TouchableOpacity>
                                <Text style={{ textAlign: 'center', fontFamily: "Poppins-Bold", }}>
                                    {lang === 'fr' ? 'Contacter' :
                                     lang === 'es' ? 'Contactar' :
                                     lang === 'cr' ? 'Kontak' :
                                     'Contact'}
                                </Text>
                            </View>

                        }
                    </View>

                    <View style={styles.bloc__titre__thematique}>
                        <Text style={styles.titre__thematique}>{getThemeLangText(theme).sous_titre}</Text>
                    </View>

                    {
                        getThemeLangText(theme).description !== "" &&
                        <View style={styles.bloc__description__thematique}>
                            <View style={styles.bloc__titre__description}>
                                <Text style={styles.unite__titre_description}>Description</Text>
                            </View>
                            <Text style={styles.description__unite} numberOfLines={3}><Autolink
                            text={getThemeLangText(theme).description}
                            linkStyle={{ color: '#25a1f1', fontStyle: 'italic' }} />
                            </Text>

                            <TouchableOpacity onPress={() => { setModal(true); setModalType("autre"); setContent({ titre: getThemeLangText(theme).titre, description: getThemeLangText(theme).description }) }}
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 25, marginTop: 10 }} >
                                <Text style={{ fontFamily: 'popLight', fontSize: 13, marginRight: 5, color: "#de382f" }}>
                                    {lang === 'fr' ? 'Voir Plus' :
                                     lang === 'es' ? 'Ver más' :
                                     lang === 'cr' ? 'Gade plis' :
                                     'See more'}
                                </Text>
                                <SimpleLineIcons
                                    name="arrow-down" size={15} color="#de382f"
                                />
                            </TouchableOpacity>
                        </View>
                    }


                    {
                        (theme.contenu.galerie.length > 0 || theme.contenu.video !== "" || theme.contenu.audio !== "" || (theme.contenu.handicape !== "" && theme.contenu.handicape !== true)) &&
                        <View style={styles.bloc__contenus__thematique}>
                            <View style={[styles.bloc__titre__description, { height: "40%" }]}>
                                <Text style={styles.unite__titre_description}>{lang === 'fr' ? "Contenu" :
                                  lang === 'es' ? "Contenido" :
                                  lang === 'cr' ? "Kontni" :
                                  'Contents'}</Text>
                            </View>
                            <View style={styles.bloc__bouton__contenus}>
                                {
                                    theme.contenu.galerie.length > 0 &&
                                    <TouchableOpacity style={styles.bouton__contenus}
                                        onPress={() => {
                                            setModal(true)
                                            setModalType("autre")
                                            setModeText(theme.contenu.galerie)
                                        }}
                                    >
                                        <Image
                                            source={require('../../assets/images/round_collections_black_24dp.png')}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </TouchableOpacity>
                                }

                                {theme.contenu.video !== "" &&
                                    <TouchableOpacity style={styles.bouton__contenus} onPress={() => {
                                        if (theme.contenu.video !== "offline") {
                                            setModalVideo(theme.contenu.videoLSF, isNotNullOrEmpty(getThemeLangText(theme).contenu.video) ? getThemeLangText(theme).contenu.video : theme.contenu.video)
                                        } else {
                                            setModalType('video')
                                            setVideoFile(contenus.videos.filter(item => item.id === theme.identifiant)[0].file)
                                            setModal(true)
                                        }
                                    }}>
                                        <Image
                                            source={require('../../assets/images/round_play_circle_filled_black_24dp.png')}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </TouchableOpacity>
                                }

                                {theme.contenu.audio !== "" &&
                                    <TouchableOpacity style={styles.bouton__contenus} onPress={() => {
                                        if (theme.contenu.audio !== "offline") {
                                            goToLink(isNotNullOrEmpty(getThemeLangText(theme).contenu.audio) ? getThemeLangText(theme).contenu.audio : theme.contenu.audio)
                                        } else {
                                            playAudio ?
                                                playSound(contenus.audios.filter(item => item.id === theme.identifiant)[0].file)
                                                : stopSound()
                                        }
                                    }}>
                                        <Image
                                            source={require('../../assets/images/round_volume_up_black_24dp.png')}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </TouchableOpacity>
                                }

                                {
                                    (theme.contenu.handicape !== "" && theme.contenu.handicape !== true) &&
                                    <TouchableOpacity style={styles.bouton__contenus}
                                        onPress={() => {
                                            setModal(true)
                                            setModalType("autre")
                                            setImg(theme.contenu.handicape)
                                        }}
                                    >
                                        <Image
                                            source={require('../../assets/images/baseline_accessible_black_24dp.png')}
                                            style={{ width: "100%", height: "100%" }}
                                        />
                                    </TouchableOpacity>
                                }


                            </View>

                        </View>
                    }

                    {(theme.info_pratique.liste[2].url !== "" || theme.info_pratique.liste[1].url !== "" || theme.info_pratique.liste[0].url !== "") &&
                        <View style={styles.bloc__contenus__info__pratique}>
                            <View style={[styles.bloc__titre__description, { height: "45%" }]}>
                                <Text style={styles.unite__titre_description}>{lang === 'fr' ? "Information(s) Pratique(s)" :
                                    lang === 'es' ? "Información(es) Práctica(s)" :
                                    lang === 'cr' ? "Enfòmasyon pratik" :
                                    'Practical(s) Information(s)'}</Text>
                            </View>
                            <View style={styles.bloc__bouton__info__pratique}>
                                {theme.info_pratique.liste[0].url !== "" &&
                                    <TouchableOpacity onPress={() => goToLink(theme.info_pratique.liste[0].url)}
                                        style={[styles.bouton__info__pratique, { backgroundColor: "#ebdb34", }]}
                                    >
                                        {/* <Text style={styles.text__bouton__info__pratique}>
                                     Agenda
                                    </Text> */}
                                        <FontAwesome name="eye" size={25} color="white" />
                                    </TouchableOpacity>
                                }

                                {
                                    theme.info_pratique.liste[1].url !== "" &&
                                    <TouchableOpacity onPress={() => goToLink(theme.info_pratique.liste[1].url)}
                                        style={[styles.bouton__info__pratique, { backgroundColor: "#3fcbf5" }]}
                                    >
                                        {/* <Text style={styles.text__bouton__info__pratique}>
                                    {lang === "fr" ? "Où manger ?" : 'Catering ?'}
                                    </Text> */}
                                        <MaterialIcons name="food-bank" size={25} color="white" />
                                    </TouchableOpacity>
                                }


                                {theme.info_pratique.liste[2].url !== "" &&
                                    <TouchableOpacity onPress={() => goToLink(theme.info_pratique.liste[2].url)}
                                        style={[styles.bouton__info__pratique, { backgroundColor: "#2ca331" }]}
                                    >
                                        {/* <Text style={styles.text__bouton__info__pratique}>
                                    {lang === "fr" ? "Où dormir ?" : 'Accommodation ?'}
                                    </Text> */}
                                        <Ionicons name="bed" size={25} color="white" />
                                    </TouchableOpacity>
                                }
                            </View>

                        </View>
                    }


                    {   //interets.filter(item => item.titre !== theme.titre).length > 0 &&
                        <View style={[styles.bloc__decouvrir, { borderWidth: 1, borderStyle: "solid", borderColor: "#97999a", paddingBottom: 10 }]}>
                            <View style={styles.bloc__titre__description}>
                                <Text style={styles.unite__titre_description}>{lang === 'fr' ? "À découvrir sur le même tronçon" :
                                  lang === 'es' ? "A descubrir en la misma sección" :
                                  lang === 'cr' ? "Pou vwè kote menm seksyon la" :
                                  'To discover on the same section'}</Text>
                            </View>

                            {
                                interets.map((item, i) => (
                                    <Fragment key={i} >
                                        <TouchableOpacity style={styles.bloc__liste__decouvrir} onPress={() => navigation.replace("Interet", { theme: lang === 'fr' ? item : interetSave.filter(etape => etape.reference === item.reference)[0], titre: item.titre })}>
                                            <View style={styles.bloc__image__decouvrir}>
                                                <Image
                                                    source={item.image ? { uri: item.image } : require('../../assets/interet.png')}
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                            </View>

                                            <View style={styles.bloc__titre__decouvrir}>
                                                <Text style={styles.text__titre__decouvrir} numberOfLines={1}>{item.titre}</Text>
                                                <Text numberOfLines={2} style={[styles.text__bouton__afficher__parcours, { color: 'black', textAlign: 'left', fontSize: 10 }]}>
                                                    {item.description}
                                                </Text>
                                            </View>

                                            <View style={styles.bloc__icon__bouton__decouvrir}>
                                                <SimpleLineIcons style={styles.icon__footer} name="arrow-right" size={20} color="#de382f" />
                                            </View>

                                        </TouchableOpacity>
                                        {
                                            i < interets.length - 1 &&
                                            <View style={styles.divider} />
                                        }
                                    </Fragment>
                                ))
                            }
                        </View>
                    }
                </View>


            </ScrollView>
            <SlidingUpPanel ref={bs}>
                <View style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    padding: 15
                }}>
                    <View>
                        <View style={{ marginBottom: 30 }} />
                        {curImg ?
                            <Image
                                source={{ uri: curImg }}
                                style={{ width: (width / 2) + 150, height: (width / 2) + 150 }}
                                resizeMode="contain"
                            />
                            : <Loading />
                        }
                    </View>
                </View>
            </SlidingUpPanel>

        </SafeAreaView>
    )
}

export default Interet

const styles = StyleSheet.create({
    divider: {
        borderColor: '#e6e6f2',
        borderWidth: 1,
    },
    bouton__afficher__parcours: {
        padding: 6,
        marginBottom: "7%",
        backgroundColor: "#de382f",
        borderRadius: 25,
        justifyContent: "center",
        elevation: 0.5,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 5 },
    },
    text__bouton__afficher__parcours: {
        fontFamily: "Poppins-Bold",
        fontSize: 13,
        color: "white",
        textAlign: "center",
    },
    centeredView: {
        flex: 1,
        marginTop: 50,
        backgroundColor: 'green'
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 2,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '95%',
    },
    button: {
        borderRadius: 10,
        padding: 2,
        elevation: 2,
        backgroundColor: '#de382f',
        marginTop: 5,
        marginBottom: 5,
        width: 100
    },
    container: {
        flex: 1,
        padding: 15,
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%'
    },
    bloc__distance_lieu: {
        width: "100%",
        height: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    bloc__distance: {
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    bloc__image_thematique: {
        width: "100%",
        height: 150
    },
    bloc__bouton__action: {
        width: "100%",
        //height: 15,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
        marginTop: -25,
        //marginBottom: 20
    },
    bouton__action: {
        width: 50,
        height: 50,
        //marginLeft: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30 / 2,
        backgroundColor: "#de382f"
    },
    bloc__titre__thematique: {
        //width: "100%",
        //height: 20,
        //marginTop: 35,
        marginBottom: 10
    },
    titre__thematique: {
        color: "black",
        fontFamily: "Poppins-Bold",
        fontSize: 13,
        color: "black",
        textAlign: "center"
    },
    bloc__description__thematique: {
        width: "100%",
        height: 170,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "grey",
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 10,
    },
    bloc__titre__description: {
        width: "100%",
        //height: "30%",
        backgroundColor: "#de382f",
        justifyContent: "center",
        padding: "3%",
        borderTopLeftRadius: 20
    },
    unite__titre_description: {
        fontFamily: "Poppins-Bold",
        fontSize: 15,
        color: "white",
        textAlign: "left"
    },
    description__unite: {
        width: "100%",
        fontFamily: "Poppins-Light",
        fontSize: 13,
        color: "black",
        textAlign: "left",
        padding: 7
    },
    bouton__en__savoir__plus: {
        width: "100%",
        //height: 15,
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 25,
    },
    bloc__contenus__thematique: {
        width: "100%",
        height: 100,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#97999a",
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: "2%"
    },
    bloc__bouton__contenus: {
        width: "100%",
        height: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        padding: 15
    },
    bouton__contenus: {
        width: 50,
        height: 50,
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30 / 2,
    },
    bloc__bouton__info__pratique: {
        width: "100%",
        //height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 3,
        padding: 5
    },

    bloc__contenus__info__pratique: {
        width: "100%",
        height: 110,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#97999a",
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: "2%"
    },

    bouton__info__pratique: {
        width: "30%",
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
        borderWidth: 1,
        borderBottomWidth: 5,
        borderColor: 'gray',
    },

    text__bouton__info__pratique: {
        fontFamily: "Poppins-Bold",
        fontSize: 10,
        color: "white",
    },
    bloc__bouton__info__decouvrir: {
        width: "100%",
        height: 400,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
        padding: 15
    },

    bloc__decouvrir: {
        width: "100%",
        //height: 150,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: 10,
        marginTop: 10,
    },
    bloc__liste__decouvrir: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
        padding: 5,
    },
    bloc__image__decouvrir: {
        width: "20%",
        height: 50,
    },
    bloc__titre__decouvrir: {
        width: "70%",
        height: 100,
        justifyContent: "center",
        //alignItems: "center",
        marginLeft: 10
    },
    bloc__icon__bouton__decouvrir: {
        width: "10%",
        height: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    text__titre__decouvrir: {
        fontFamily: "Poppins-Bold",
        fontSize: 13,
        color: "#de382f",
        textAlign: "left"
    },


    main_unite: {
        height: 80,
        flexDirection: 'row'
    },
    image: {
        width: 80,
        height: 70,
        margin: 5,
        backgroundColor: 'gray'
    },
    content_unite: {
        flex: 1,
        margin: 5
    },
    container__parcours__info: {
        width: "100%",
        marginTop: "5%",
        flexDirection: "column",
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
    },

})
