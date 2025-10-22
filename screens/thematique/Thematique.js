import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Loading from '../../components/Loading';
import BluetothList from '../../components/bluetothList/BluetothList';
import { functions } from '../../helpers/Constants';
const Thematique = (props) => {
    const {navigation} = props

    const [loading, setLoading] = useState(true)
    const [translate, setTranslate] = useState([])
    const [lang, setLang] = useState('fr')
    const [thematique, setThematique] = useState([])

    useEffect(() => {
        const getTranslate = async () => {
            let translate = await functions.getStore('@translate')
                translate = JSON.parse(translate)
                setTranslate(translate.filter(item => item.type === "Thématique" && (lang == "en" ? item.lang === undefined : item.lang == lang)))
        }

        getTranslate()

        //return () => getTranslate()

    }, [lang])

    useEffect(() => {
        functions.getLang()
        .then(lang => {
            setLang(lang)
        })
    }, [])

    let mounted = true

    useEffect(() => {
        const getData = async () => {
            if (mounted) {
                let thematiques = await functions.getStore('@thematiques')
                thematiques = JSON.parse(thematiques)
                setThematique(thematiques)
                setLoading(false)
            }
        }

        getData()
        return () => mounted = false
    }, [lang])

    useEffect(() => {
        if (thematique.length > 0) {
            navigation.setOptions({
                title: lang === 'fr' ? thematique[0].pageTitre : (translate.length > 0 ? translate[0].pageTitre : thematique[0].pageTitre)
            });
        }
    }, [translate, thematique])

    const afficherDetailThematique = (item, i) => {
        navigation.navigate("DetailThematique", {thematique: item, indice: i, translateThematique: getLangText(item), lang})
    }

    const getThematiqueTranslate = thematique_id => translate.filter(item => item.thematique_id === thematique_id && (lang == "en" ? item.lang === undefined : item.lang == lang))

    const getLangText = thematique => lang === 'fr' ? thematique : (translate.length > 0 ? (getThematiqueTranslate(thematique.identifiant).length > 0 ? getThematiqueTranslate(thematique.identifiant)[0] : thematique) : thematique)

    function compare( a, b ) {
      if ( a.reference < b.reference ){
        return -1;
      }
      if ( a.reference > b.reference ){
        return 1;
      }
      return 0;
    }

    return loading ? <Loading /> : (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ImageBackground style={ styles.imgBackground } resizeMode='cover' source={require('../../assets/images/M0P9YW.png')}>
            <BluetothList navigation={navigation}/>
                <ScrollView contentContainerStyle={styles.container__liste__thematique}>
                    {
                        thematique.length > 0 &&
                        thematique.sort(compare).map((item, i) => (
                            <TouchableOpacity style={styles.thematique__item} key={i} onPress={() =>afficherDetailThematique(item, item.reference)}>
                                <Text style={styles.text__thematique_item}>{getLangText(item).titre}</Text>
                                <SimpleLineIcons style={styles.icon__footer} name="arrow-right" size={20} color="#ebdb34" />
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </ImageBackground>
        </View>
    )
}

export default Thematique

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flexDirection : "column",
        alignItems: 'center',
        justifyContent: 'center',
      },

    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1
},

    container__liste__thematique: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
        paddingBottom: 50
    },
    thematique__item: {
        width: "90%",
        backgroundColor: "#de382f",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding:15,
        borderRadius: 10,
        marginBottom: 25
    },
    icon__menue_item: {
        width: "10%",
    },
    text__thematique_item: {
        width: "90%",
        color : "black",
        fontFamily : "Poppins-Bold",
        fontSize: 13,
        color: "white",
        textAlign: "left"
    },

})
