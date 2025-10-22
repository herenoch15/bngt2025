import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image, ImageBackground,
    Modal, Pressable,
    ScrollView,
    StatusBar,
    StyleSheet, Text,
    TouchableOpacity,
    View
} from 'react-native';
import Swiper from 'react-native-swiper';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';


import SlidingUpPanel from 'rn-sliding-up-panel';
import BluetothList from '../../components/bluetothList/BluetothList';
import Loading from '../../components/Loading';
import { functions } from '../../helpers/Constants';
const { height, width } = Dimensions.get('window')

const DetailTroncon = (props) => {
    const { navigation, route } = props
    const { troncons, lang, tronconLang, indice } = route.params

    const bs = useRef(null)

    const [modal, setModal] = useState(false)
    const [content, setContent] = useState({
        titre: '',
        description: ''
    })
    const [load, setLoad] = useState(true)
    const [translate, setTranslate] = useState([])

    useEffect(() => {

        const getTranslate = async () => {
            let translate = await functions.getStore('@translate')
            translate = JSON.parse(translate)
            setTranslate(translate.filter(item => item.type === "Unité" && item.lang == lang))
            setLoad(false)
        }

        getTranslate()

    }, [])

    useEffect(() => {
        navigation.setOptions({
            title: lang === 'fr' ? troncons[0].sous_titre : (tronconLang.length > 0 ? tronconLang[0].sous_titre : troncons[0].sous_titre)
        });
    }, [])

    useEffect(() => {
        if (bs.current !== null) {
            bs.current.hide()
        }
    }, [load])

    const afficherUnite = unite => {
        navigation.navigate("DetailUnite", { unite, uniteTranslate: getUniteLangText(unite), lang })
    }

    const afficherCarte = (id) => {
        navigation.navigate("Carte", { troncon: id })
    }

    const [curImg, setCurImg] = useState(false)

    const images = [require('../../assets/images/reeg.png'), require('../../assets/images/fqf.png'), require('../../assets/images/ssggs.png')];

    const getTronTranslate = troncon_id => tronconLang.filter(item => item.troncon_id === troncon_id && item.lang == lang)

    const getLangText = troncon => lang === 'fr' ? troncon : (tronconLang.length > 0 ? (getTronTranslate(troncon.identifiant).length > 0 ? getTronTranslate(troncon.identifiant)[0] : troncon) : troncon)


    const getUniteTranslate = unite_id => translate.filter(item => item.unite_id === unite_id && item.lang == lang)

    const getUniteLangText = unite => lang === 'fr' ? unite : (translate.length > 0 ? (getUniteTranslate(unite.identifiant).length > 0 ? getUniteTranslate(unite.identifiant)[0] : unite) : unite)

    return load ? <Loading /> : (
        <View style={styles.container}>
            <BluetothList navigation={navigation}/>
            <Modal animationType="slide" transparent={true} visible={modal}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ backgroundColor: '#2ca331', width: '95%', alignItems: 'center', margin: 3 }}>
                            <Text style={{ color: 'white', padding: 8, fontFamily: 'Poppins-Bold' }}>
                                {content.titre}
                            </Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={{ fontSize: 13, padding: 8, fontFamily: 'popLight', textAlign: 'justify', marginBottom: 100 }}>
                                {content.description}
                            </Text>
                        </ScrollView>

                        <Pressable onPress={() => setModal(!modal)}
                            style={[styles.bouton__afficher__parcours,
                            {
                                minHeight: '5%', width: "25%", position: "absolute",
                                bottom: '10%', marginBottom: 5
                            }
                            ]}
                        >
                            <Text style={[styles.text__bouton__afficher__parcours, { fontSize: 13 }]} >
                                {lang === 'fr' ? 'Fermer' :
                          lang === 'es' ? 'Cerrar' :
                          lang === 'cr' ? 'Kité' :
                          'Close'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <ImageBackground style={styles.imgBackground} resizeMode='cover' source={require('../../assets/images/22.png')} >
                <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', }}>
                    <Swiper dotStyle={{ display: 'none' }} activeDotStyle={{ display: 'none' }}
                        style={styles.bloc__slider__parcours}
                        index={indice}
                        nextButton={<Text style={{ fontSize: 60, color: '#2ca331' }}>›</Text>}
                        prevButton={<Text style={{ fontSize: 60, color: '#2ca331' }}>‹</Text>}
                        showsButtons={true}
                    >
                        {
                            troncons.map((item, i) => (
                                <ScrollView key={i} showsVerticalScrollIndicator={false}>
                                    <View style={[styles.container__parcours__info, { height: (height / 2) + 50, justifyContent: "flex-start", alignItems: "center", }]}>
                                        <View style={styles.bloc__titre__parcours}>
                                            <View>
                                                <Text style={styles.titre__parcours}>{getLangText(item).titre.split(':')[0]}</Text>
                                                <Text style={styles.titre__parcours}>{getLangText(item).titre.split(':')[1]}</Text>
                                            </View>
                                            <Text style={styles.numero__parcours}>{i + 1}/{troncons.length}</Text>
                                        </View>

                                        <View style={styles.image__parcours}>
                                            {
                                                item.galerie.length > 0 ?
                                                    <Swiper autoplay={true} activeDotColor="#2ca331">
                                                        {
                                                            item.galerie.map((img, indice) => (
                                                                <TouchableOpacity key={`image-${indice}`} onPress={() => { setCurImg(img); bs.current.show() }}>
                                                                    <Image
                                                                        source={{ uri: img }}
                                                                        style={{ width: "100%", height: "100%" }}
                                                                        resizeMode="contain"
                                                                    />
                                                                </TouchableOpacity>
                                                            ))
                                                        }
                                                    </Swiper>
                                                    :
                                                    <TouchableOpacity onPress={() => { setCurImg(false); bs.current.show() }}>
                                                        <Image
                                                            source={require('../../assets/images/22.png')}
                                                            style={{ width: "100%", height: "100%" }}
                                                            resizeMode="contain"
                                                        />
                                                    </TouchableOpacity>
                                            }

                                        </View>

                                        <View style={styles.bloc__description__parcours}>
                                            <Text style={styles.description__parcours} numberOfLines={3}>
                                                {getLangText(item).description}...
                                            </Text>

                                            {
                                                getLangText(item).description !== "" &&
                                                <TouchableOpacity onPress={() => { setModal(true); setContent({ titre: getLangText(item).titre, description: getLangText(item).description }) }}
                                                    style={{ flexDirection: 'row', alignSelf: 'flex-end' }} >
                                                    <Text style={{ fontFamily: 'popLight', fontSize: 13, marginRight: 5, color: "#2ca331" }}>
                                                        {lang === 'fr' ? 'Voir Plus' :
                                                         lang === 'es' ? 'Ver más' :
                                                         lang === 'cr' ? 'Gade plis' :
                                                         'See more'}
                                                    </Text>
                                                    <SimpleLineIcons
                                                        name="arrow-down" size={15} color="#2ca331"
                                                    />
                                                </TouchableOpacity>
                                            }
                                        </View>

                                        <TouchableOpacity style={styles.bouton__afficher__parcours} onPress={() => afficherCarte(item.reference)}>
                                            <Text style={styles.text__bouton__afficher__parcours}>{lang === 'fr' ? "Afficher sur la carte" :
                                                                                                   lang === 'es' ? "Mostrar en el mapa" :
                                                                                                   lang === 'cr' ? "Gade anle kat la" :
                                                                                                   'Show on the map'}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.container__parcours__info, { flexDirection: 'row', justifyContent: 'space-around', padding: 5, borderRadius: 20 }]}>
                                        <View style={{ alignItems: 'center' }}>
                                            <MaterialCommunityIcons name="arrow-left-right" size={30} color="black" />
                                            <Text style={[styles.text__bouton__afficher__parcours, { color: 'black' }]}>{item.distance.titre}</Text>
                                            <Text style={[styles.text__bouton__afficher__parcours, { color: 'black' }]}>{item.distance.valeur} Km</Text>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <Entypo name="man" size={30} color="black" />
                                            <Text style={[styles.text__bouton__afficher__parcours, { color: 'black' }]}>{getLangText(item).difficulte.titre}</Text>
                                            <Text style={[styles.text__bouton__afficher__parcours, { color: 'black' }]}>{getLangText(item).difficulte.valeur}</Text>
                                        </View>
                                    </View>

                                    <View style={[styles.container__parcours__info, { padding: 5, borderRadius: 0, marginBottom: 10 }]}>
                                        <View style={{ flexDirection: "row", alignContent: 'flex-end' }}>
                                            <MaterialCommunityIcons name="map-marker-radius" size={20} color="#2ca331" />
                                            <Text style={[styles.text__bouton__afficher__parcours, { color: 'black', marginLeft: 2, marginTop: 1 }]}>{lang === "fr" ? "Unités" :
                                               lang === "es" ? "Unidades" :
                                               lang === "cr" ? "Inite" :
                                               "Units"}</Text>
                                        </View>
                                        {
                                            item.unites.map((unite, i) => (
                                                <Fragment key={i}>
                                                    <TouchableOpacity style={styles.main_unite} onPress={() => afficherUnite(unite)}>
                                                        <Image style={styles.image} source={unite.galerie.length > 0 ? { uri: unite.galerie[0] } : images[i]} />
                                                        <View style={styles.content_unite}>
                                                            <View>
                                                                <Text numberOfLines={2} style={[styles.text__bouton__afficher__parcours, { color: '#2ca331', textAlign: 'justify', fontSize: 10 }]}>
                                                                    {getUniteLangText(unite).titre}
                                                                </Text>
                                                                <Text numberOfLines={2} style={[styles.text__bouton__afficher__parcours, { color: 'black', textAlign: 'left', fontSize: 10 }]}>
                                                                    {getUniteLangText(unite).description}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <SimpleLineIcons
                                                            style={{ marginTop: 30 }}
                                                            name="arrow-right" size={20} color="#2ca331"
                                                        />
                                                    </TouchableOpacity>
                                                    {
                                                        i < item.unites.length - 1 &&
                                                        <View style={styles.divider} />
                                                    }
                                                </Fragment>
                                            ))
                                        }
                                    </View>
                                </ScrollView>
                            ))
                        }
                    </Swiper>
                </View>
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
                                    style={{ width: (width / 2) + 100, height: (width / 2) + 100 }}
                                    resizeMode="contain"
                                />
                                : <Loading />}
                        </View>
                    </View>
                </SlidingUpPanel>

            </ImageBackground>
            <StatusBar style="auto" />
        </View>
    )
}

export default DetailTroncon

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        marginTop: 50
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 2,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '95%'
    },
    button: {
        borderRadius: 10,
        padding: 2,
        elevation: 2,
        backgroundColor: '#2ca331',
        marginTop: 5,
        marginBottom: 5,
        width: 100
    },

    divider: {
        borderColor: '#e6e6f2',
        borderWidth: 1,
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
    main_unite: {
        height: 80,
        flexDirection: 'row'
    },
    container: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
    },

    imgBackground: {
        width: '100%',
        height: '100%',
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: 'center',
        //backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },

    container__parcours__info: {
        width: "86%",
        marginTop: "10%",
        flexDirection: "column",
        backgroundColor: 'rgb(255, 255, 255)',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    bloc__titre__parcours: {
        width: "100%",
        //height: "15%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#2ca331",
        padding: 15,
        borderTopLeftRadius: 20,
    },
    titre__parcours: {
        fontFamily: "Poppins-Bold",
        fontSize: 14,
        color: "white",
        textAlign: "center"
    },
    numero__parcours: {
        fontFamily: "Poppins-Bold",
        fontSize: 14,
        color: "#ebdb34",
        textAlign: "center",
    },
    image__parcours: {
        width: "100%",
        height: "40%"
    },
    bloc__description__parcours: {
        padding: 15,
        flex: 1
    },
    description__parcours: {
        fontFamily: "Poppins-Bold",
        fontSize: 13,
        color: "black",
        textAlign: "left"
    },
    bouton__afficher__parcours: {
        //width: "50%",
        //height: "10%",
        padding: 6,
        marginBottom: "5%",
        backgroundColor: "#2ca331",
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
    bloc__slider__parcours: {
        paddingLeft: "7%"
    }
})
