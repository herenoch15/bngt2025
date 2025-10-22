import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Loading from '../../components/Loading';
import BluetothList from '../../components/bluetothList/BluetothList';
import { functions } from '../../helpers/Constants';
const Unite = (props) => {
    const {navigation} = props

    const [unites, setUnites] = useState([])
    const [loading, setLoading] = useState(false)
    const [translate, setTranslate] = useState([])
    const [lang, setLang] = useState('fr')

    useEffect(() => {

        const getTranslate = async () => {
            let translate = await functions.getStore('@translate')
                translate = JSON.parse(translate)
                setTranslate(translate.filter(item => item.type === "Unité" && item.lang == lang))
        }

        getTranslate()

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
                let uniteData = await functions.getStore('@unites')
                uniteData = JSON.parse(uniteData)
                setUnites(uniteData)
                setLoading(false)
            }
        }

        getData()
        return () => mounted = false
    }, [lang])

    useEffect(() => {

        if (unites.length > 0) {
            navigation.setOptions({
                title: lang === 'fr' ? unites[0].pageTitre : (translate.length > 0 ? translate[0].pageTitre : unites[0].pageTitre)
            });
        }
     }, [translate, unites])

    const afficherUnite = unite => {
        navigation.navigate("DetailUnite", {unite, uniteTranslate: getUniteLangText(unite), lang})
    }

    const getUniteTranslate = unite_id => translate.filter(item => item.unite_id === unite_id && item.lang == lang)

    const getUniteLangText = unite => lang === 'fr' ? unite : (translate.length > 0 ? (getUniteTranslate(unite.identifiant).length > 0 ? getUniteTranslate(unite.identifiant)[0] : unite) : unite)



    function compare(a, b) {
      const aReference = Number(a.reference);
      const bReference = Number(b.reference);

      // Si l'une des références est invalide, vous pouvez choisir de gérer ce cas
      if (isNaN(aReference) || isNaN(bReference)) {
        if ( a.reference < b.reference ){
           return -1;
         }
         if ( a.reference > b.reference ){
           return 1;
         }
         return 0;
      }

      if (aReference < bReference) {
        return -1;
      }
      if (aReference > bReference) {
        return 1;
      }
      return 0;
    }

    return loading ? <Loading /> :(
        <View style={styles.container}>
        <StatusBar />
        <ImageBackground style={ styles.imgBackground }
             resizeMode='cover'
             source={require('../../assets/images/backunite.jpg')}>
            <BluetothList navigation={navigation}/>
            <ScrollView contentContainerStyle={styles.container__liste__unite}>
                {
                    unites.sort(compare).map((item, i) => (
                        <TouchableOpacity key={i} style={styles.unite__item} onPress={() => afficherUnite(item, getUniteLangText(item).titre)}>
                            <View style={{ width: '90%', flexDirection: 'column'}}>
                                <Text style={styles.text__unite_item}>
                                    {getUniteLangText(item).titre}
                                </Text>
                            </View>
                            <SimpleLineIcons style={styles.icon__menue_item} name="arrow-right" size={20} color="#2ca331" />
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>


        </ImageBackground>

    </View>
    )
}

export default Unite

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

    container__liste__unite: {
        marginTop: 10,
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 50
    },
    unite__item: {
        width: "90%",
        backgroundColor: "#d46e2c",
        flexDirection: "row",
        flexWrap: 'wrap',
        alignItems: "center",
        padding:10,
        borderRadius: 10,
        marginBottom: 25
    },
    icon__menue_item: {
        width: "10%",
    },
    text__unite_item: {
        color : "black",
        fontFamily : "Poppins-Bold",
        fontSize: 13,
        textAlign: "center"
    },
})
