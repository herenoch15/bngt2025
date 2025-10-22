import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    Linking,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loading from '../../components/Loading';
import BluetothList from '../../components/bluetothList/BluetothList';
import { functions } from '../../helpers/Constants';
const { height } = Dimensions.get('window')

const Apropos = (props) => {
    const {navigation} = props
    const [text, setText] = useState({})
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [lang, setLang] = useState('')
    let mounted = true

    useEffect(() => {
        functions.getLang()
        .then(lang => {
            setLang(lang)
        })
    }, [])

    useEffect(() => {

        const getData = async () => {
            
            if (lang !== '' && mounted) {
                let apropos
                let data = lang === 'fr' ? '@apropos' :
                  lang === 'es' ? '@aproposES' :
                  lang === 'cr' ? '@aproposCR' :
                  '@aproposEN'

                functions.getStore(data)
                .then(value => {
                    apropos = JSON.parse(value)
                    props.navigation.setOptions({
                        title: apropos.titre,
                    });
                    setText(apropos)
                    setLoading(false)
                })

                // if (lang === 'fr') {
                   
                //     //apropos = await functions.getStore('@apropos')
                // }else{
                //     apropos = await functions.getStore('@aproposEN')
                // }
            }
        }

        getData()

        return () => mounted = false

    }, [lang])

    const goToLink = link => link !== '' && Linking.openURL(link)

    const openCallPhone = phone => Linking.openURL(Platform.OS === 'android' ? 'tel:'+phone : 'telprompt:'+phone)
    const onShare = async () => {
        try {
          //console.log('onShare::::'+this.state.urlWeb.title)
            const result = await Share.share({
              title: 'BNGT',
              message:'https://appbngt.cangt.fr/',
              url: 'https://appbngt.cangt.fr/'
            });
            if (result.action === Share.sharedAction) {
              if (result.activityType) {
                // shared with activity type of result.activityType
              } else {
                // shared
              }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
        } catch (error) {
         
        }
      }
    return  loading ? <Loading /> : (
        <ImageBackground style={ styles.imgBackground }
            resizeMode='cover'
            source={require('../../assets/images/M0P9YW.png')}>
            <BluetothList navigation={props.navigation}/>
            <Modal animationType="slide" transparent={true} visible={modal}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <View style={{ backgroundColor: '#209ed5', width: '98%', alignItems: 'center', margin: 3 }}>
                            <Text style={{ color: 'white', padding: 8, fontFamily: 'Poppins-Bold' }}>
                                {text.partenaire.titre}
                            </Text>
                        </View>

                        <FlatList
                            key={'_'}
                            data={text.partenaire.gauche.concat(text.partenaire.droite)}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                            renderItem={({ item, index }) => (
                                <View key={index} style={{ width: '50%', flexDirection: 'column', alignItems: 'center', padding: 2, borderColor: '#000', borderWidth: 2, }}>
                                    <Image
                                        source={item.logo !== "" ? {uri: item.logo} : require('../../assets/images/logo_300.png')}
                                        style={{ width: 150, height: 150 }}
                                        resizeMode="contain"
                                    />
                                    <Text style={{ padding: 8, fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#209ed5' }}>{item.nom}</Text>
                                    {
                                        item.adresse !== '' &&
                                        <Text style={{ padding: 7, fontFamily: 'Poppins-Light', textAlign: 'center', color: '#209ed5' }}>{item.adresse}</Text>

                                    }
                                    {
                                        item.tel !== '' &&
                                        <Text style={{ padding: 7, fontFamily: 'Poppins-Light', textAlign: 'center', color: '#209ed5' }}>{item.tel}</Text>
                                    }
                                    {
                                        item.email !== '' &&
                                        <Text style={{ padding: 7, fontFamily: 'Poppins-Light', textAlign: 'center', color: '#209ed5' }}>{item.email}</Text>
                                    }
                                </View>
                            )}
                        />

                        <Pressable style={{ height:"6%", flexDirection: "row", justifyContent:"center", alignItems:"center", borderRadius: 25, margin:10, backgroundColor: "#299bc4"}}s onPress={() => {
                            setModal(!modal)
                        }}>
                            <Text style={{ color: 'white', padding: 8, fontFamily: 'Poppins-Bold', fontSize: 13 }} >
                            {lang === 'fr' ? 'Fermer' :
                      lang === 'es' ? 'Cerrar' :
                      lang === 'cr' ? 'Kité' :
                      'Close'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <ScrollView style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                <View style={{ justifyContent: "center", alignItems:"center", marginTop: 15, marginBottom: 50}}>
                    <View style={{width:"90%"}}>
                        {
                            text.paragraphe.map((item, i) => (
                                <Text key={i} style={{marginBottom:15, textAlign:"center", fontFamily:"Poppins-Bold", fontSize:14, fontStyle: 'italic', color:"white"}}>
                                    {item}
                                </Text>
                            ))
                        }
                    </View>
                    <Pressable style={{ height:"5%",  flexDirection: "row", justifyContent:"center", alignItems:"center", borderRadius: 25, margin:12, paddingLeft: 5,paddingRight:5, backgroundColor: "#299bc4"}} onPress={() => {
                            onShare()
                        }}>
                            <MaterialCommunityIcons style={styles.icon__menue_item} name="share" size={25} color="#ebdb34" />
                            <Text style={{ color: 'white', padding: 8, fontFamily: 'Poppins-Bold', fontSize: 15 }} >
                            {lang === 'fr' ? 'Partagez sur vos réseaux' :
                      lang === 'es' ? 'Comparte en tus redes' :
                      lang === 'cr' ? 'Pataje si rezo aw' :
                      'Share'}
                            </Text>
                    </Pressable>
                    <TouchableOpacity onPress={() => setModal(true)}
                        style={{width:"90%", borderWidth: 1, borderColor: '#156c92',  borderBottomWidth: 5, padding: 10,
                          flexDirection: "row",  justifyContent:"center", alignItems:"center", borderRadius: 25, margin:10, backgroundColor: "#299bc4"}}>
                        <Text style={{color:"#fff", fontFamily:"Poppins-Bold", fontSize:13}}>{text.partenaire.titre}</Text>
                    </TouchableOpacity>

                    <View style={{marginTop: "2%", width:"95%", flexDirection:"row", justifyContent:"space-between"}}>
                        <View style={{width:"49%", padding: 5, borderWidth:1, borderStyle:"solid", borderColor:"white", borderRadius:20, alignItems:"center"}}>
                            <View style={{ marginTop:"5%", alignItems:"center",  }}>
                                <Text style={[styles.coordonne, {color: '#209ed5', fontSize: 13}]}>OT Anse Bertrand</Text>
                                <Text style={[styles.coordonne, {fontSize: 9}]}>Rue Cheik Anta Diop</Text>
                                <Text style={[styles.coordonne, {fontSize: 9}]}>97121 Anse Bertrand</Text>
                                <TouchableOpacity onPress={() => goToLink("http://ot-ansebertrand.fr/")}>
                                    <Text style={[styles.coordonne, {fontSize: 9}]}>
                                        http://ot-ansebertrand.fr/
                                    </Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <FontAwesome5 onPress={() => openCallPhone("+590590857311")}
                                        name="phone-alt"
                                        size={20}
                                        color="#ebdb34"
                                        style={{ alignItems: "flex-start", marginRight: 10 }} />
                                    <Text style={[styles.coordonne, {fontSize: 9}]}>05 90 85 73 11</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{width:"49%", padding: 5, borderWidth:1, borderStyle:"solid", borderColor:"white", borderRadius:20, alignItems:"center"}}>
                            <View style={{ marginTop:"5%", alignItems:"center",  }}>
                                <Text style={[styles.coordonne, {color: '#209ed5', fontSize: 13}]}>OT Port-Louis</Text>
                                <Text style={[styles.coordonne, {fontSize: 9}]}>Rue gambetta</Text>
                                <Text style={[styles.coordonne, {fontSize: 9}]}>97117 Port-Louis</Text>
                                <TouchableOpacity onPress={() => goToLink("https://lenordguadeloupe.com/")}>
                                    <Text style={[styles.coordonne, {fontSize: 9}]}>
                                        https://lenordguadeloupe.com/
                                    </Text>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <FontAwesome5 onPress={() => openCallPhone("+590590223387")} name="phone-alt" size={20} color="#ebdb34" style={{ alignItems: "flex-start", marginRight: 10 }} />
                                    <Text style={[styles.coordonne, {fontSize: 9}]}>05 90 22 33 87</Text>
                                </View>
                            </View>
                        </View>

                    </View>

                    <View style={{color:"white", width:"95%", height: 180,
                        flexDirection:"column", paddingTop: 10,
                        justifyContent:"center", alignItems:"center",
                        marginTop:"5%", borderWidth:1, borderStyle:"solid",
                        borderColor:"white", borderRadius:25,
                    }}>
                        <View style={{width:"50%", flexDirection:"row", justifyContent:"center"}}>
                            <Text style={[styles.coordonne, {fontSize: 18, color: '#209ed5'}]}>CANGT</Text>
                        </View>
                        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <View />
                            <View style={{width:"50%", flexDirection:"row", justifyContent:"center"}}>
                                <Text style={styles.coordonne}>{text.adresse}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <View />
                            <View style={{width:"50%", flexDirection:"row", justifyContent:"center"}}>
                                <Text style={styles.coordonne}>97131 Petit-Canal</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <View >
                                <FontAwesome5 onPress={() => openCallPhone("+590590857311")} style={styles.icon__menue_item} name="phone-alt" size={20} color="#ebdb34" />
                            </View>
                            <View style={{width:"50%", flexDirection:"row", justifyContent:"center"}}>
                                <Text style={styles.coordonne}>0590-85-73-11</Text>
                            </View>

                        </View>

                        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop: 10}}>
                            <View >
                                <MaterialCommunityIcons style={styles.icon__menue_item} name="email" size={20} color="#ebdb34" />
                            </View>
                            <View style={{width:"50%", flexDirection:"row", justifyContent:"center"}}>
                                <Text style={styles.coordonne}>contact.bngt@cangt.fr</Text>
                            </View>
                        </View>

                        <View style={{width:"80%", height:40, flexDirection:"row", justifyContent:"space-between", marginTop: 10, marginBottom: 15}}>
                            <View style={{width:"20%"}} />
                            <View style={{width:"80%", flexDirection:"row", justifyContent:"center"}}>
                                <TouchableOpacity style={{width:"30%"}} onPress={() => goToLink("https://cangt.fr")}>
                                    <Image
                                        source={require('../../assets/images/home.png')}
                                        style={{width: "50%", height: "70%",  borderRadius:5  }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={{width:"30%"}} onPress={() => goToLink("https://mobile.twitter.com/cangtguadeloupe")}>
                                    <Image
                                        source={require('../../assets/images/tumblr-square.png')}
                                        style={{width: "50%", height: "70%",  borderRadius:5  }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity style={{width:"30%"}} onPress={() => goToLink("https://www.youtube.com/channel/UCsQGkcUziK0n_16KRb3VHqQ")}>
                                    <Image
                                        source={require('../../assets/images/youtube.png')}
                                        style={{width: "50%", height: "70%",  borderRadius:5  }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity style={{width:"30%"}} onPress={() => goToLink("https://www.facebook.com/Communaut%C3%A9-dAgglom%C3%A9ration-du-Nord-Grande-Terre-1549380035312226")}>
                                    <Image
                                        source={require('../../assets/images/facebook-square.png')}
                                        style={{width: "50%", height: "70%", borderRadius:5 }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                   
                    <View style={{width:"95%", flexDirection:"column", justifyContent:"center", marginTop: "2%", marginBottom: 15}}>
                        <View style={{flexDirection:"row", justifyContent:"center"}}>
                            <Text style={[styles.coordonne, {fontSize: 14, color: '#ffffff'}]}>
                                {lang === 'fr' ? "Application mobile financée par :" :
                       lang === 'es' ? "Aplicación móvil financiada por :" :
                       lang === 'cr' ? "Aplikasyon mobil ki finanse pa :" :
                       "Mobile application funded by :"}
                            </Text>
                        </View>
                        <View style={{height: 100, flexDirection:"row", backgroundColor: "white",
                            justifyContent:"space-between", marginTop: 10, borderRadius:5}}>
                            <Image
                                source={require('../../assets/images/logo_eu.png')}
                                style={{width: "50%", height: "100%" }}
                                resizeMode="contain"
                            />

                            <Image
                                source={require('../../assets/images/logo_fr.png')}
                                style={{width: "50%", height: "100%", borderRadius: 5 }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                </View>
            </ScrollView>
        </ImageBackground>
    )
}

export default Apropos

const styles = StyleSheet.create({
    part : {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"flex-start"
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
        height: height-150
    },
    button: {
        borderRadius: 10,
        padding: 3,
        elevation: 2,
        backgroundColor: '#209ed5',

    },

    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1
    },
    coordonne:{
        color:"white",
        fontFamily:"Poppins-Bold",
        fontSize:11,

    }
})
