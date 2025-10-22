import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Loading from '../../components/Loading';
import BluetothList from '../../components/bluetothList/BluetothList';
import { functions } from '../../helpers/Constants';
const Troncon = (props) => {
    const {navigation} = props
    const [troncons, setTroncons] = useState([])
    const [loading, setLoading] = useState(true)
    const [translate, setTranslate] = useState([])
    const [lang, setLang] = useState('fr')
    let mounted = true

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

    useLayoutEffect(() => {
        functions.getLang()
        .then(async (lang) => {
            let translate = await functions.getStore('@translate')
                translate = JSON.parse(translate)
                setTranslate(translate.filter(item => item.type === "Tronçon" && item.lang == lang))
            setLang(lang)
        })
    }, [])


    useEffect(() => {
        if (troncons.length > 0) {
            props.navigation.setOptions({
                title: lang === 'fr' ? troncons[0].pageTitre : (translate.length > 0 ? translate[0].pageTitre : troncons[0].pageTitre)
            });
        }
    }, [translate, troncons, lang])

    useEffect(() => {

        const getData = async () => {
            if (lang !== '' && mounted) {
                let uniteData = await functions.getStore('@unites'),
                        troncon = await functions.getStore('@troncons')

                    uniteData = JSON.parse(uniteData)
                    troncon = JSON.parse(troncon)

                    let data = []

                    troncon.sort(compare).forEach(item => {
                        data.push({
                            ...item,
                            unites: uniteData.filter(unit => unit.ref_troncon === item.reference)
                        })
                    })

                    setTroncons(data)
                    setLoading(false)
            }
        }

        getData()

        return () => mounted = false

    }, [lang])

    const afficherDetailTroncon = (indice) => {
        navigation.navigate("DetailTroncon", { troncons, indice, lang, tronconLang: translate})
    }

    const getTronTranslate = troncon_id => translate.filter(item => item.troncon_id === troncon_id && item.lang == lang)

    const getLangText = troncon => lang === 'fr' ? troncon : (translate.length > 0 ? (getTronTranslate(troncon.identifiant).length > 0 ? getTronTranslate(troncon.identifiant)[0] : troncon) : troncon)


    return loading ? <Loading /> :  (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <BluetothList navigation={navigation}/>
            <ImageBackground style={ styles.imgBackground }
                resizeMode='cover'
                source={require('../../assets/images/22.png')}>

                <View style={styles.container__liste__Troncon}>
                    {
                        troncons.length > 0 &&
                        troncons.map((item , i) => (
                            <TouchableOpacity key={i} style={styles.Troncon__item} onPress={() => afficherDetailTroncon(i)}>
                                <Text style={styles.text__Troncon_item}>
                                    {getLangText(item).titre}
                                </Text>
                                <SimpleLineIcons style={styles.icon__footer} name="arrow-right" size={20} color="#ebdb34" />
                            </TouchableOpacity>
                        ))
                    }
                </View>


            </ImageBackground>

        </View>
    )
}

export default Troncon

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

        container__liste__Troncon: {
            marginTop: 30,
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingBottom: 50
        },
        Troncon__item: {
            width: "90%",
            height: "10%",
            backgroundColor: "#2ca331",
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
        text__Troncon_item: {
            width: "90%",
            color : "black",
            fontFamily : "Poppins-Bold",
            fontSize: 13,
            color: "white",
            textAlign: "left"
        },

})
