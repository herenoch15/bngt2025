import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import Swiper from 'react-native-swiper';
import SlidingUpPanel from 'rn-sliding-up-panel';
import BluetothList from '../../components/bluetothList/BluetothList';
import Loading from '../../components/Loading';
import { functions } from '../../helpers/Constants';
const { height, width } = Dimensions.get('window')

const DetailUnite = (props) => {
    const { navigation, route } = props
    const { unite, uniteTranslate, lang } = route.params
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
    const [periode, setPeriode] = useState({
        titre: '',
        liste: [],
        indice: -1
    })
    //const [translate, setTranslate] = useState([])

    const getUniteLangText = () => lang === 'fr' ? unite : uniteTranslate

    useEffect(() => {
        navigation.setOptions({
            title: getUniteLangText().sous_titre + ' ' + unite.reference
        });
    }, [])

    useEffect(() => {
        if (bs.current !== null) {
            bs.current.hide()
        }
    }, [loading])

    let mounted = true

    /*useEffect(() => {

        const getTranslate = async () => {
            let translate = await functions.getStore('@translate')
                translate = JSON.parse(translate)
                setTranslate(translate.filter(item => item.type === "Interet"))
        }

        getTranslate()

    }, [])*/

    useEffect(() => {
        const getData = async () => {
            if (lang !== '' && mounted) {
              const categoriesToDisplay = [
                "1626952290",
                "1626952235",
                "1626952177",
                "1626951535"
              ]
                let dat = await functions.getStore('@interets')
                dat = JSON.parse(dat)
                let data = dat.filter(item => parseInt(item.unite) === parseInt(unite.reference) && (parseInt(item.priorite) >= 1 && parseInt(item.priorite) <= 3) && categoriesToDisplay.includes(item.categorie))
                    .map(item => item)

                let translate = await functions.getStore('@translate')

                translate = JSON.parse(translate)
                translate = translate.filter(item => item.type === "Interet" && (lang == "en" ? item.lang === undefined : item.lang == lang))

                setInteretSave(dat)
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
                setInterets(data)
                setLoading(false)
            }
        }

        getData()
        return () => mounted = false
    }, [lang])

    // const images = [require('../../assets/images/reeg.png'), require('../../assets/images/fqf.png'), require('../../assets/images/ssggs.png')];

    const periodeImg = [require('../../assets/images/amerindien.png'), require('../../assets/images/esclavage.png'), require('../../assets/images/industrielle.png')]

    const periodeImage = [require('../../assets/images/periode_amerindienne.jpg'), require('../../assets/images/periode_esclavagiste.jpg'), require('../../assets/images/periode_industrielle.jpg')]

    const afficheTheme = etape => {
        //navigation.navigate("Interet", {theme: etape, titre: etape.titre})
        let inter = lang === 'fr' ? etape : interetSave.filter(item => item.reference === etape.interet_id)[0]
        navigation.navigate("Interet", { theme: inter, titre: etape.titre })
    }

    const afficherCarte = (id) => {
        navigation.navigate("Carte", { unite: id })
    }

    //const getThemeTranslate = interet_id => translate.filter(item => item.interet_id === interet_id)

    //const getThemeLangText = interet => lang === 'fr' ? interet : (translate.length > 0 ? (getThemeTranslate(interet.reference).length > 0 ? getThemeTranslate(interet.reference)[0] : interet) : interet)


    return loading ? <Loading /> : (
        <View style={styles.container}>
            <BluetothList navigation={navigation}/>
            <View style={styles.bloc__image__unite}>
                {
                    unite.galerie.length > 0 ?
                        <Swiper autoplay={true} activeDotColor="#d46e2c">
                            {
                                unite.galerie.map((img, indice) => (
                                    <TouchableOpacity onPress={() => { setCurImg(img); bs.current.show() }} key={`image-${indice}`}>
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
                                source={require('../../assets/images/carte.png')}
                                style={{ width: "100%", height: "100%" }}
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
                                    <View style={{ backgroundColor: '#d46e2c', width: '95%', alignItems: 'center', margin: 3 }}>
                                        <Text style={{ color: 'white', padding: 8, fontFamily: 'Poppins-Bold' }}>
                                            {content.titre}
                                        </Text>
                                    </View>

                                    <ScrollView>
                                        <Text style={{ fontSize: 13, padding: 8, fontFamily: 'popLight', textAlign: 'justify', marginBottom: 100 }}>
                                            {content.description}
                                        </Text>
                                    </ScrollView>
                                </Fragment>
                                :
                                <Fragment>
                                    <View style={{ backgroundColor: '#d46e2c', width: '95%', alignItems: 'center', margin: 3 }}>
                                        <Text style={{ color: 'white', padding: 8, fontFamily: 'Poppins-Bold' }}>
                                            {periode.titre}
                                        </Text>
                                    </View>

                                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1 }}>
                                        <Image
                                            source={periodeImage[periode.indice]}
                                            style={{ width: width, height: height / 2 }}
                                            resizeMode="contain"
                                        />

                                        <View style={{ marginLeft: 5, marginBottom: 100 }}>
                                            {
                                                periode.liste.map((item, i) => (
                                                    <Text key={i} style={{ fontSize: 13, fontFamily: 'popLight' }}>
                                                        - {item}
                                                    </Text>
                                                ))
                                            }
                                        </View>
                                    </ScrollView>

                                </Fragment>
                        }

                        <Pressable style={[styles.bouton__afficher__parcours, { minHeight: 35, height: "5%", width: "25%", position: "absolute", bottom: '10%', marginBottom: 5 }]} onPress={() => {
                            setModal(!modal)
                            setContent({ titre: '', description: '' })
                            setPeriode({ titre: '', liste: [] })
                        }}>
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

            <ScrollView style={styles.bloc__contenu__unite} showsVerticalScrollIndicator={false}>
                <View style={[styles.bloc__description__unite, { justifyContent: "flex-start", alignItems: "center" }]}>
                    <View style={styles.bloc__titre__description}>
                        <Text style={styles.unite__titre_description}>Description</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={[styles.text__titre__etape, { padding: 3 }]}>{getUniteLangText().titre.split(':')[0]}</Text>
                        <Text style={[styles.text__titre__etape]}>{getUniteLangText().titre.split(':')[1]}</Text>
                    </View>
                    <Text style={styles.description__unite} numberOfLines={2}>
                        {getUniteLangText().description}
                    </Text>

                    {
                        getUniteLangText().description !== "" &&
                        <TouchableOpacity onPress={() => { setModal(true); setContent({ titre: getUniteLangText().titre, description: getUniteLangText().description }) }}
                            style={{ position: 'absolute', right: 25, bottom: 55, flexDirection: 'row', alignItems: 'center' }} >
                            <Text style={{ fontFamily: 'popLight', fontSize: 13, marginRight: 5, color: "#d46e2c" }}>
                                {lang === 'fr' ? 'Voir Plus' :
                                 lang === 'es' ? 'Ver más' :
                                 lang === 'cr' ? 'Gade plis' :
                                 'See more'}
                            </Text>
                            <SimpleLineIcons
                                name="arrow-down" size={15} color="#d46e2c"
                            />
                        </TouchableOpacity>
                    }


                    <TouchableOpacity style={[styles.bouton__afficher__parcours, { marginTop: '15%' }]} onPress={() => afficherCarte(unite.reference)}>
                        <Text style={styles.text__bouton__afficher__parcours}>{lang === 'fr' ? "Afficher sur la carte" :
                                                                               lang === 'es' ? "Mostrar en el mapa" :
                                                                               lang === 'cr' ? "Gade anle kat la" :
                                                                               'Show on the map'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.bloc__description__unite, { flexDirection: 'row', justifyContent: 'space-around', padding: 5, borderRadius: 20 }]}>
                    <View style={{ alignItems: 'center' }}>
                        <MaterialCommunityIcons name="arrow-left-right" size={30} color="black" />
                        <Text style={[styles.text__bouton__afficher__parcours, { color: 'black' }]}>{unite.distance.titre}</Text>
                        <Text style={[styles.text__bouton__afficher__parcours, { color: 'black' }]}>{unite.distance.valeur} Km</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Entypo name="man" size={30} color="black" />
                        <Text style={[styles.text__bouton__afficher__parcours, { color: 'black' }]}>{lang === 'fr' ? "Difficulté" :
                                                                                                    lang === 'es' ? "Dificultad" :
                                                                                                    lang === 'cr' ? "Difikilte" :
                                                                                                    "Level"}</Text>
                        <Text style={[styles.text__bouton__afficher__parcours, { color: 'black' }]}>{getUniteLangText().difficulte.valeur}</Text>
                    </View>
                </View>

                <View style={[styles.bloc__description__unite, { height: 180 }]}>
                    <View style={[styles.bloc__titre__description, { height: 40 }]}>
                        <Text style={styles.unite__titre_description}>{lang === "fr" ? "Périodes" :
                       lang === "es" ? "Períodos" :
                       lang === "cr" ? "Peryòd" :
                       "Periods"}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                        {
                            getUniteLangText().periode.liste.length > 0 &&
                            getUniteLangText().periode.liste.map((item, i) => (
                                <Fragment key={i}>
                                    {
                                        item.liste.length > 0 ?
                                            <TouchableOpacity style={{ alignItems: 'center' }}
                                                onPress={() => {
                                                    setPeriode({
                                                        titre: item.titre,
                                                        liste: item.liste,
                                                        indice: i
                                                    })
                                                    setModal(true)
                                                }}
                                            >
                                                <View style={{
                                                    width: 60, height: "50%",
                                                    justifyContent: "center",
                                                    borderWidth: 1,
                                                    borderColor: 'gray',
                                                    borderBottomWidth: 5,
                                                    borderRadius: 12,
                                                    paddingVertical: 3, paddingHorizontal: 5,
                                                    marginBottom: 5
                                                }}>
                                                    <Image
                                                        source={periodeImg[i] ? periodeImg[i] : require('../../assets/images/amerindien.png')}
                                                        style={{ width: "100%", height: "100%" }}
                                                    />
                                                </View>
                                                <Text style={[styles.text__bouton__afficher__parcours, { color: 'black' }]}>
                                                    {/* juste pour récupérer le titre de la période en enlevant le mot "période". */}
                                                    {/* Ex pour fr : "Période Améridienne" = "Améridienne" */}
                                                    {/* Ex pour en : "Amerindian period" = "Amerindian" */}
                                                    {lang == "fr" ? item.titre.split(' ')[1] : item.titre.split(' ')[0]}
                                                </Text>
                                                <Text style={[styles.text__bouton__afficher__parcours, { color: 'black' }]}>
                                                    {item.annee}
                                                </Text>
                                            </TouchableOpacity>
                                            :
                                            <View style={{ alignItems: 'center' }}>
                                                <View style={{ borderWidth: 1, borderColor: 'gray', width: 60, height: "50%", marginBottom: 5 }}>
                                                    <Image
                                                        source={periodeImg[i]}
                                                        style={{ width: "100%", height: "100%", backgroundColor: 'rgba(0, 0, 0, 0.1)', tintColor: 'gray' }}
                                                    />
                                                </View>
                                                <Text style={[styles.text__bouton__afficher__parcours, { color: 'gray' }]}>
                                                    {lang == "fr" ? item.titre.split(' ')[1] : item.titre.split(' ')[0]}
                                                </Text>
                                                <Text style={[styles.text__bouton__afficher__parcours, { color: 'gray' }]}>
                                                    {item.annee}
                                                </Text>
                                            </View>
                                    }
                                </Fragment>
                            ))
                        }
                    </View>
                </View>

                <View style={[styles.container__parcours__info, { padding: 0, borderRadius: 0, borderWidth: 1, borderStyle: "solid", borderColor: "#97999a" }]}>
                    <View style={[styles.bloc__titre__description, { height: 40, flexDirection: "row", alignContent: 'flex-end', justifyContent: "flex-start" }]}>
                        <MaterialCommunityIcons name="map-marker-radius" size={20} color="white" />
                        <Text style={[styles.text__bouton__afficher__parcours, { color: 'white', marginLeft: 2, marginTop: 1 }]}>{lang === 'fr' ? 'Étapes' :
                     lang === 'es' ? 'Pasos' :
                     lang === 'cr' ? 'Etap' :
                     'Steps'}</Text>
                    </View>
                    {
                        interets.map((etape, i) => (
                            <Fragment key={i}>
                                <TouchableOpacity style={styles.main_unite} onPress={() => afficheTheme(etape)}>
                                    <Image
                                        style={styles.image}
                                        source={etape.image ? { uri: etape.image } : require('../../assets/interet.png')}
                                    />

                                    <View style={styles.content_unite}>
                                        <View>
                                            <Text numberOfLines={1} style={[styles.text__bouton__afficher__parcours, { color: '#d46e2c', textAlign: 'justify' }]}>
                                                {/* {getThemeLangText(etape).titre} */}
                                                {etape.titre}
                                            </Text>
                                            <Text numberOfLines={2} style={[styles.text__bouton__afficher__parcours, { color: 'black', textAlign: 'left', fontSize: 10 }]}>
                                                {etape.description}...
                                            </Text>
                                        </View>
                                    </View>
                                    <SimpleLineIcons
                                        style={{ marginTop: 30 }}
                                        name="arrow-right" size={20} color="#d46e2c"
                                    />
                                </TouchableOpacity>
                                {
                                    i < interets.length - 1 &&
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
                            : <Loading />}
                    </View>
                </View>
            </SlidingUpPanel>

            <StatusBar style="auto" />
        </View>
    )
}

export default DetailUnite

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
        backgroundColor: '#d46e2c',
        marginTop: 5,
        marginBottom: 5,
        width: 100
    },


    divider: {
        borderColor: '#e6e6f2',
        borderWidth: 1,
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

    bouton__afficher__parcours: {
        // width: "55%",
        // height: "15%",
        padding: 6,
        marginTop: "5%",
        marginBottom: "5%",
        backgroundColor: "#d46e2c",
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

    container: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: 'center',
        justifyContent: 'center',
    },

    bloc__image__unite: {
        width: "100%",
        height: "30%"
    },

    bloc__contenu__unite: {
        width: "85%",
        height: "65%",
        marginTop: "5%",
    },

    bloc__description__unite: {
        width: "100%",
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
        height: "20%",
        backgroundColor: "#d46e2c",
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
        padding: 7,
    },

    bouton__en__savoir__plus: {
        width: "100%",
        height: "15%",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: 25,
    },
    bloc__titre__etape: {
        width: "100%",
        height: "10%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 5
    },
    icon__titre__etape: {
        marginRight: 10
    },
    text__titre__etape: {
        fontFamily: "Poppins-Bold",
        fontSize: 13,
    },
    bloc__etape__unite: {
        width: "100%",
    },
    bloc__liste__etape: {
        width: "100%",
        height: "30%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderColor: "grey",
        paddingTop: "3%",
        paddingBottom: "3%"
    },
    bloc__image__etape: {
        width: "20%",
        height: "100%",
    },
    bloc__titre__description__etape: {
        width: "70%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft: 7
    },
    bloc__bouton__icon__etape: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "10%",
        height: "100%"
    },
    titre__etape: {
        fontFamily: "Poppins-Bold",
        fontSize: 13,
        color: "green",
        textAlign: "left",
    },
    descripton__etape: {
        fontFamily: "Poppins-Light",
        fontSize: 11,
        color: "black",
        textAlign: "justify",
    }
})
