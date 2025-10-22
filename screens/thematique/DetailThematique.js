import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swiper from 'react-native-swiper';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SlidingUpPanel from 'rn-sliding-up-panel';
import BluetothList from '../../components/bluetothList/BluetothList';
import Loading from '../../components/Loading';
import { functions } from '../../helpers/Constants';
const { height, width } = Dimensions.get('window')

const DetailThematique = (props) => {
    const {navigation, route} = props
    const {thematique, indice, translateThematique, lang} = route.params
    const bs = useRef(null)

    const [curImg, setCurImg] = useState(false)
    const [interets, setInterets] = useState([])
    const [interetSave, setInteretSave] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [content, setContent] = useState({
        titre: '',
        description: '',
    })
    const [modeText, setModeText] = useState({
        titre: '',
        liste: [],
        indice: -1
    })
    //const [translate, setTranslate] = useState([])

    /*useEffect(() => {

        const getTranslate = async () => {
            let transt = await functions.getStore('@translate')
            transt = JSON.parse(transt)

            setTranslate(transt.filter(item => item.type === "Interet"))
        }

        getTranslate()

    }, [])*/

    const getThematiqueLangText = () => lang === 'fr' ? thematique : translateThematique

    useEffect(() => {
        navigation.setOptions({
            title: getThematiqueLangText().sous_titre + ' ' + (indice),
        });
    }, [])

    useEffect(() => {

        if (bs.current !== null) {
            bs.current.hide()
        }
    }, [loading])

    let mounted = true

    useEffect(() => {

        const getData = async () => {
            if (lang !== '' && mounted) {
                let dat = await functions.getStore('@interets')
                dat = JSON.parse(dat)
                let data = dat.filter(item => parseInt(item.thematique) === parseInt(thematique.reference) && (parseInt(item.priorite) >= 1 && parseInt(item.priorite) <= 3))
                        .map(item => item)

                let translate = await functions.getStore('@translate')

                translate = JSON.parse(translate)
                translate = translate.filter(item => item.type === "Interet" && (lang == "en" ? item.lang === undefined : item.lang == lang))

                setInteretSave(dat)
                if (lang !== 'fr' && translate.length > 0) {
                    data.forEach((item, i) => {
                        let valEn = translate.filter(trans => trans.interet_id === item.reference)
                        data[i] = valEn.length > 0 ? valEn[0] : data[i]
                    })
                }
                data.sort((a, b) => a.titre < b.titre ? -1 : 1)

                setInterets(data)
                setLoading(false)
            }
        }

        getData()
        return () => mounted = false
    }, [lang])

    const images = [require('../../assets/images/reeg.png'), require('../../assets/images/fqf.png'), require('../../assets/images/ssggs.png')];

    const afficheTheme = etape => {
        let inter = lang === 'fr' ? etape : interetSave.filter(item => item.reference === etape.interet_id)[0]
        navigation.navigate("Interet", {theme: inter, titre: etape.titre})
    }

    //const getThemeTranslate = interet_id => translate.filter(item => item.interet_id === interet_id)

    //const getThemeLangText = interet => lang === 'fr' ? interet : (translate.length > 0 ? (getThemeTranslate(interet.reference).length > 0 ? getThemeTranslate(interet.reference)[0] : interet) : interet)

    const afficherCarte = (id) => {
        navigation.navigate("Carte", {thematique: id})
    }

    const objImg = [
        require('../../assets/images/goal.png'),
        require('../../assets/images/interpretation.png'),
        require('../../assets/images/signaletique.png'),
        require('../../assets/images/commentaire.png')
    ]

    return loading ? <Loading /> :  (
        <View style={styles.container}>
            <BluetothList navigation={navigation}/>
            <View style={styles.bloc__image_thematique}>
                {
                    thematique.galerie.length > 0 ?
                    <Swiper autoplay={true} activeDotColor="#de382f">
                        {
                            thematique.galerie.map((img, indice) => (
                                <TouchableOpacity onPress={() => {setCurImg(img); bs.current.show()}} key={`image-${indice}`}>
                                    <Image
                                        source={{ uri: img }}
                                        style={{width: "100%", height: "100%" }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            ))
                        }
                    </Swiper>
                    :
                    <TouchableOpacity onPress={() => {setCurImg(false); bs.current.show()}}>
                        <Image
                            source={require('../../assets/interet.png')}
                            style={{width: "100%", height: "100%" }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                }
            </View>

            <Modal animationType="slide" transparent={true} visible={modal}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    {
                            content.titre !== '' ?
                            <Fragment>
                                <View style={{ backgroundColor: '#de382f', width: '95%', alignItems: 'center', margin: 3 }}>
                                    <Text style={{ color: 'white', padding: 8, fontFamily: 'Poppins-Bold' }}>
                                        {content.titre}
                                    </Text>
                                </View>

                                <ScrollView>
                                    <Text style={{fontSize: 13, padding: 8, fontFamily: 'popLight', textAlign: 'justify', marginBottom: 100 }}>
                                        {content.description}
                                    </Text>
                                </ScrollView>
                            </Fragment>
                            :
                            <Fragment>
                                <View style={{ backgroundColor: '#de382f', width: '95%', alignItems: 'center', margin: 3 }}>
                                    <Text style={{ color: 'white', padding: 8, fontFamily: 'Poppins-Bold' }}>
                                        {modeText.titre}
                                    </Text>
                                </View>

                                <Image
                                    source={objImg[modeText.indice]}
                                    style= {{ height: '15%', width: '15%' }}
                                    resizeMode="contain"
                                />

                                <Text style={[styles.text__titre__etape, {padding: 3, fontSize: 15}]}>{getThematiqueLangText().titre}</Text>

                                <View style={{ alignItems: 'baseline', marginBottom: 100 }}>
                                {
                                    modeText.liste.map((item, i) => (
                                        <Text key={i} style={{ fontSize: 13, fontFamily: 'popLight', textAlign: 'justify' }}>
                                         - {item}
                                        </Text>
                                    ))
                                }
                                </View>

                            </Fragment>
                        }

                        <Pressable style={[styles.bouton__afficher__parcours, {minHeight:35, height: '5%', width: '25%', position: "absolute", bottom: '10%'}]} onPress={() => {
                            setModal(!modal)
                            setContent({titre: '', description: ''})
                            setModeText({ titre: '', liste: [], indice: -1 })
                        }}>
                            <Text style={[styles.text__bouton__afficher__parcours, {fontSize: 13}]} >
                            {lang === 'fr' ? 'Fermer' :
                      lang === 'es' ? 'Cerrar' :
                      lang === 'cr' ? 'Kité' :
                      'Close'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.bloc__contenu__unite}>

                <View style={[styles.bloc__description__thematique, {justifyContent: "flex-start", alignItems: "center"}]}>
                    <View style={styles.bloc__titre__description}>
                        <Text style={styles.unite__titre_description}>Description</Text>
                    </View>
                    {
                        getThematiqueLangText().titre.split(':').length > 0 ?
                        getThematiqueLangText().titre.split(':').map((textTitre, i) => (
                            <Text key={i} style={[styles.text__titre__etape, i === 0 ? {padding: 3} : {}]}>{textTitre}</Text>
                        ))
                        :
                        <Text style={[styles.text__titre__etape, {padding: 3}]}>{getThematiqueLangText().titre}</Text>
                    }
                    {/* <Text style={[styles.text__titre__etape, {padding: 3}]}>{getThematiqueLangText().titre.split(':')[0]}</Text>
                    <Text style={[styles.text__titre__etape]}>{getThematiqueLangText().titre.split(':')[1]}</Text> */}
                    <Text style={styles.description__unite} numberOfLines={2}>
                        {getThematiqueLangText().description}
                    </Text>

                    {
                        getThematiqueLangText().description !== "" &&
                        <TouchableOpacity onPress={() => {setModal(true); setContent({titre: getThematiqueLangText().titre, description: getThematiqueLangText().description})}}
                            style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', right: 20, bottom: 40 }} >
                            <Text style={{ fontFamily: 'popLight', fontSize: 13, marginRight: 5, color:"#de382f" }}>
                                {lang === 'fr' ? 'Voir Plus' :
                                 lang === 'es' ? 'Ver más' :
                                 lang === 'cr' ? 'Gade plis' :
                                 'See more'}
                            </Text>
                            <SimpleLineIcons
                                name="arrow-down" size={15} color="#de382f"
                            />
                        </TouchableOpacity>
                    }

                    <TouchableOpacity style={[styles.bouton__afficher__parcours, {marginTop: 15}]} onPress={() => afficherCarte(thematique.reference)}>
                        <Text style={styles.text__bouton__afficher__parcours}>{lang === 'fr' ? "Afficher sur la carte" :
                                                                               lang === 'es' ? "Mostrar en el mapa" :
                                                                               lang === 'cr' ? "Gade anle kat la" :
                                                                               'Show on the map'}</Text>
                    </TouchableOpacity>

                </View>

                <View style={[styles.container__parcours__info, { flexDirection: 'row', justifyContent: 'space-around', padding: 5, borderRadius: 20 }]}>
                    <View style={{ alignItems: 'center' }}>
                        <MaterialCommunityIcons name="arrow-left-right" size={30} color="black" />
                        <Text style={[styles.text__bouton__afficher__parcours, {color: 'black'}]}>Distance</Text>
                        <Text style={[styles.text__bouton__afficher__parcours, {color: 'black'}]}>{getThematiqueLangText().distance.valeur}</Text>
                    </View>
                    <View style={{ alignItems: 'center'  }}>
                        <Entypo  name="man" size={30} color="black" />
                        <Text style={[styles.text__bouton__afficher__parcours, {color: 'black'}]}>{lang === 'fr' ? "Difficulté" :
                                                                                                    lang === 'es' ? "Dificultad" :
                                                                                                    lang === 'cr' ? "Difikilte" :
                                                                                                    "Level"}</Text>
                        <Text style={[styles.text__bouton__afficher__parcours, {color: 'black'}]}>{getThematiqueLangText().difficulte.valeur}</Text>
                    </View>
                </View>

                <View style={[styles.bloc__description__thematique,{ height:155}]}>
                    <View style={styles.bloc__titre__description}>
                        <Text style={styles.unite__titre_description}>{lang === 'fr' ? "Objectifs et Interprétations" :
                          lang === 'es' ? "Objetivos e Interpretaciones" :
                          lang === 'cr' ? "Objektif epi Entèpretasyon" :
                          "Objectives and interpretations"}</Text>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}}>

                        {
                            thematique.objectif_interpretation.liste.length > 0 &&
                            getThematiqueLangText().objectif_interpretation.liste.map((item, i) => (
                                <Fragment key={i}>
                                    {
                                        item.liste.length > 0 ?
                                        <TouchableOpacity style={{ alignItems:"center", width:"25%"}}
                                            onPress={() => {
                                                setModal(true)
                                                setModeText({
                                                    titre: item.titre,
                                                    liste: item.liste,
                                                    indice: i
                                                })
                                            }}>
                                            <View style={[{
                                                width: 60, height: "52%",
                                                marginBottom: 10,
                                                justifyContent: "center",
                                                borderWidth: 1,
                                                borderColor: 'gray',
                                                borderBottomWidth: 5,
                                                borderRadius: 12, paddingVertical: 3,paddingHorizontal: 5
                                            }]}>
                                                <Image
                                                    source={objImg[i] ? objImg[i] : require('../../assets/images/goal.png')}
                                                    style={{width: "100%", height: "90%" }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            <Text style={[styles.text__bouton__afficher__parcours, {color: 'black', fontSize: 8,}]}>
                                                {item.titre}
                                            </Text>
                                        </TouchableOpacity>
                                        :
                                        <View style={{ alignItems:"center", width:"25%"}}>
                                            <View style={{borderWidth: 1, borderColor: 'gray', width: 60, height: "52%", marginBottom: 10, justifyContent: "center", backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
                                                <Image
                                                    source={objImg[i] ? objImg[i] : require('../../assets/images/goal.png')}
                                                    style={{width: "100%", height: "90%", tintColor:'gray' }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                            <Text style={[styles.text__bouton__afficher__parcours, {color: 'gray', fontSize: 10}]}>
                                                {item.titre}
                                            </Text>
                                        </View>
                                    }
                                </Fragment>
                            ))
                        }

                    </View>
                </View>


                <View style={[styles.bloc__decouvrir, {borderWidth: 1, borderStyle: "solid", borderColor: "#97999a", paddingBottom: 10}]}>
                    <View style={[styles.bloc__titre__description, { width:"100%", flexDirection: "row", justifyContent:'flex-start', alignContent: 'center' }]}>
                        <MaterialCommunityIcons name="map-marker-radius" size={20} color="white" />
                        <Text style={[styles.text__bouton__afficher__parcours, {color: 'white', marginLeft: 2, marginTop: 1}]}>{lang === 'fr' ? 'Etapes' :
                     lang === 'es' ? 'Pasos' :
                     lang === 'cr' ? 'Etap' :
                     'Steps'}</Text>
                    </View>
                    {
                        interets.map((etape, i) => (
                            <Fragment key={i}>
                                <TouchableOpacity style={[styles.main_unite, {padding: 5}]} onPress={() => afficheTheme(etape)}>
                                    <Image
                                        style={styles.image}
                                        source={ etape.image ? {uri: etape.image} : require('../../assets/interet.png') }
                                    />

                                    <View style={styles.content_unite}>

                                        <Text numberOfLines={1} style={[styles.text__bouton__afficher__parcours, {color: '#de382f', textAlign: 'justify'}]}>
                                            {etape.titre}
                                        </Text>
                                        <Text numberOfLines={2} style={[styles.text__bouton__afficher__parcours, {color: 'black', textAlign: 'left', fontSize: 10}]}>
                                            {etape.description}...
                                        </Text>
                                    </View>
                                    <SimpleLineIcons
                                        style={{ marginTop: 30 }}
                                        name="arrow-right" size={20} color="#de382f"
                                    />
                                </TouchableOpacity>
                                {
                                    i < interets.length -1 &&
                                    <View style={styles.divider} />
                                }
                            </Fragment>
                        ))
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
                    padding : 15
                    }}>
                    <View>
                        <View style={{ marginBottom: 30 }} />
                        <Image
                            source={ curImg ? { uri: curImg } : require('../../assets/interet.png')}
                            style={{width: (width/2)+150, height: (width/2)+150 }}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </SlidingUpPanel>
        </View>
    )
}

export default DetailThematique

const styles = StyleSheet.create({
    appButtonContainer: {
        elevation: 8,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
      },
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
        backgroundColor: '#de382f',
        marginTop: 5,
        marginBottom: 5,
        width: 100
    },

    main_unite: {
        height: 80,
        flexDirection: 'row'
    },
    divider: {
        borderColor: '#e6e6f2',
        borderWidth: 1,
    },
    text__titre__etape: {
        fontFamily : "Poppins-Bold",
        fontSize: 13,
        textAlign: 'center'
    },

    bloc__contenu__unite: {
        width: "95%",
        height: "65%",
        marginTop: "5%",
    },

    container: {
        width: "100%",
        height: "100%",
        flexDirection : "column",
        alignItems: 'center',
        justifyContent: 'center',
    },

    bloc__description__parcours: {
        padding: 15,
        flex: 1

    },
    description__parcours: {
        fontFamily : "Poppins-Light",
        fontSize: 13,
        color: "black",
        textAlign: "left"
    },
    container__parcours__info: {
        width:"100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#97999a",
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: "2%",
        flexDirection: "column",
        flex: 1,
        marginTop: 20
    },
    bouton__afficher__parcours: {
        // width: "55%",
        // height: "25%",
        padding: 6,
        marginBottom: "2%",
        backgroundColor: "#de382f",
        borderRadius: 25,
        justifyContent: "center",
        elevation: 0.5,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 5 },
    },
    text__bouton__afficher__parcours: {
        fontFamily : "Poppins-Bold",
        fontSize: 13,
        color: "white",
        textAlign: "center",
    },
    bloc__etape: {
        width: "70%",
        height: 150,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: 3,
    },
   titre__etape: {
        fontFamily : "Poppins-Bold",
        fontSize: 12,
        color: "#de382f",
        textAlign: "center",
    },
    contenu__etape: {
        fontFamily : "Poppins-Light",
        fontSize: 11,
        color: "black",
        textAlign: "justify",
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
        height: "30%"
    },
      bloc__bouton__action: {
          width: "100%",
          height: 15,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: -10
      },
      bouton__action: {
          width: 30,
          height : 30,
          marginLeft: 10,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 30/2,
          backgroundColor: "#de382f"
      },
      bloc__titre__thematique: {
          width: "100%",
          height: 20,
          marginTop: 15,
          marginBottom: 10
      },
      titre__thematique: {
        color : "black",
        fontFamily : "Poppins-Bold",
        fontSize: 13,
        color: "black",
        textAlign: "center"
      },
      bloc__description__thematique:{
        width:"100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#97999a",
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 25,
        marginBottom: "2%",
        flexDirection: "column",
        flex: 1,
        marginTop: 20
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
        fontFamily : "Poppins-Bold",
        fontSize: 15,
        color: "white",
        textAlign: "left"
    },
    description__unite: {
        width: "100%",
        fontFamily : "Poppins-Light",
        fontSize: 13,
        color: "black",
        textAlign: "justify",
        padding: 7,
    },
    bouton__en__savoir__plus: {
        width: "100%",
        height: 15,
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 25,
        marginBottom: 30
    },


    bloc__decouvrir: {
        width:"100%",
        height: "auto",
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
        height: 75,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 15,
        paddingBottom: 15,
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderColor: "#d4d4d4",
    },
    bloc__image__decouvrir: {
        width: "20%",
        height: 60,
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
