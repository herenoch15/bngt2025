import React, {useState, useEffect, useLayoutEffect} from 'react'
import {StyleSheet, Image, Text, View, SafeAreaView,
    ScrollView, StatusBar, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { functions } from '../../helpers/Constants'
import Loading from '../../components/Loading'
import BluetothList from '../../components/bluetothList/BluetothList'

const Recherche = (props) => {
    const [loading, setLoading] = useState(true)
    const [categorie, setCategorie] = useState(null)
    const [categOpen, setCategOpen] = useState(false)
    const [categItems, setCategItems] = useState([])
    const [sousCategItems, setSousCategItems] = useState([])
    const [sousCategItemsSave, setSousCategItemsSave] = useState([])
    const [sousCategorie, setSousCategorie] = useState(null)
    const [sousCategOpen, setSousCategOpen] = useState(false)
    const [thematiqueItems, setThematiqueItems] = useState([])
    const [thematique, setThematique] = useState(null)
    const [thematiqueOpen, setThematiqueOpen] = useState(false)
    const [motCle, onChangeMotCle] = useState('');
    const [interets, setInterets] = useState([])
    const [commune, setCommune] = useState([])
    const [texte, setTexte] = useState('')
    const [resultat, setResultat] = useState([])
    const [lang, setLang] = useState('fr')
    const [translate, setTranslate] = useState([])
    const [search, setSearch] = useState(false)

    const textes = {
      fr: {
          titre: "Recherche",
          mot: {
              titre: "Mot Clé",
              placeholder: "Saissisez un nom, une commune"
          },
          cate: {
              titre: "Catégorie",
              placeholder: "Toutes les catégories"
          },
          sous: {
              titre: "Sous catégorie",
              placeholder: "Tous les sous-catégories"
          },
          theme: {
              titre: "Thématique",
              placeholder: "Tous les thématiques"
          },
          btn: "Valider"
      },

      en: {
          titre: "Search",
          mot: {
              titre: "Keyword",
              placeholder: "Enter a name, a town"
          },
          cate: {
              titre: "Category",
              placeholder: "All categories"
          },
          sous: {
              titre: "Sub-category",
              placeholder: "All subcategories"
          },
          theme: {
              titre: "Theme",
              placeholder: "All themes"
          },
          btn: "Validate"
      },

      es: {
          titre: "Búsqueda",
          mot: {
              titre: "Palabra clave",
              placeholder: "Introduce un nombre, un pueblo"
          },
          cate: {
              titre: "Categoría",
              placeholder: "Todas las categorías"
          },
          sous: {
              titre: "Subcategoría",
              placeholder: "Todas las subcategorías"
          },
          theme: {
              titre: "Tema",
              placeholder: "Todos los temas"
          },
          btn: "Validar"
      },

      cr: {
          titre: "Rechèch",
          mot: {
              titre: "Mo kle",
              placeholder: "Antre yon non, yon komin"
          },
          cate: {
              titre: "Kategori",
              placeholder: "Tout kategori"
          },
          sous: {
              titre: "Sous kategori",
              placeholder: "Tout sous-kategori"
          },
          theme: {
              titre: "Tèm",
              placeholder: "Tout tèm"
          },
          btn: "Valide"
      }
  }


    useLayoutEffect(() => {
        functions.getLang()
        .then(async lang => {
            let translate = await functions.getStore('@translate')
            translate = JSON.parse(translate)
            setTranslate(translate)
            setLang(lang)
            setTexte(textes[lang])
            props.navigation.setOptions({
                title: textes[lang].titre,
            });
        })
    }, [])

    const getThemeTranslate = interet_id => translate.filter(item => item.type === "Interet" && item.interet_id === interet_id && (lang == "en" ? item.lang === undefined : item.lang == lang))

    const getThemeLangText = interet => lang === 'fr' ? interet : (translate.length > 0 ? (getThemeTranslate(interet.reference).length > 0 ? getThemeTranslate(interet.reference)[0] : interet) : interet)

    const getThematiqueTranslate = thematique_id => translate.filter(item => item.type === "Thématique" &&  item.thematique_id === thematique_id && (lang == "en" ? item.lang === undefined : item.lang == lang))

    const getThematiqueLangText = thematique => lang === 'fr' ? thematique : (translate.length > 0 ? (getThematiqueTranslate(thematique.identifiant).length > 0 ? getThematiqueTranslate(thematique.identifiant)[0] : thematique) : thematique)

    let mounted = true

    useEffect(() => {

        const getData = async () => {

            if (lang !== '' && mounted) {
                let categories, sousCategories

                if (lang === 'fr') {
                    categories = await functions.getStore('@categories');
                    sousCategories = await functions.getStore('@sous-categories');
                } else if (lang === 'es') {
                    categories = await functions.getStore('@categoriesES');
                    sousCategories = await functions.getStore('@sous-categoriesES');
                } else if (lang === 'cr') {
                    categories = await functions.getStore('@categoriesCR');
                    sousCategories = await functions.getStore('@sous-categoriesCR');
                } else {
                    categories = await functions.getStore('@categoriesEN');
                    sousCategories = await functions.getStore('@sous-categoriesEN');
                }

                categories = JSON.parse(categories)
                categories = categories.liste.map(item => {
                    return { value: item.uid, label: item.libelle }
                })

                sousCategories = JSON.parse(sousCategories)
                sousCategories = sousCategories.liste.map(item => {
                    return { value: item.uid, label: item.libelle, categorie: item.categorie }
                })

                let thematiques = await functions.getStore('@thematiques')
                thematiques = JSON.parse(thematiques)
                thematiques.sort((a, b) => {
                    if (a.reference < b.reference) {
                      return -1
                    }else{
                      return 1
                    }
                });

                thematiques = thematiques.map(item => {
                    return { value: item.reference, label: getThematiqueLangText(item).titre }
                })

                let interets = await functions.getStore('@interets')
                interets = JSON.parse(interets)
                interets = interets.filter(item => item.priorite !== null && item.priorite != '').map(item => item)

                let communes = await functions.getStore('@communes')
                communes = JSON.parse(communes)

                interets.forEach((item, i) => {
                  if(lang == "fr")
                  {
                    interets[i].titre_search = interets[i].titre;
                  }
                  else {
                    let valEn = translate.filter(trans => trans.type === "Interet" && (lang == "en" ? trans.lang === undefined : trans.lang == lang) && trans.interet_id === item.reference)
                    interets[i].titre_search = (valEn.length > 0) ? valEn[0].titre : interets[i].titre;
                  }
                })

                setInterets(interets)
                setCategItems(categories.sort((a,b) => a.label > b.label))
                setSousCategItems(sousCategories.sort((a,b) => a.label > b.label))
                setSousCategItemsSave(sousCategories.sort((a,b) => a.label > b.label))
                //setThematiqueItems(thematiques.sort((a,b) => a.label > b.label))
                setThematiqueItems(thematiques)
                setCommune(communes)
                setLoading(false)
            }
        }

        getData()

        return () => mounted = false

    }, [lang])

    const images = [require('../../assets/images/reeg.png'), require('../../assets/images/fqf.png'), require('../../assets/images/ssggs.png')];

    const valider = () => {
        setSearch(true)
        let liste = interets
        Keyboard.dismiss()
        if (motCle !== "") {
            let com = commune.filter(item => item.libelle.toLowerCase().includes(motCle.trim().toLowerCase())),
                donnee = [], data = []
            if (com.length > 0) {
                com.forEach(commune => {
                    let a = liste.filter(item => item.commune === commune.uid)
                    if (a.length>0) donnee.push(a[0])
                })
            }
            data = liste.filter(item => item.titre_search.toLowerCase().includes(motCle.trim().toLowerCase()))
            liste = data.concat(donnee)
        }

        if (categorie !== null) {
            liste = liste.filter(item => item.categorie === categorie)
        }

        if (sousCategorie !== null) {
            liste = liste.filter(item => item.sousCateg === sousCategorie)
        }
        if (thematique !== null) {
            liste = liste.filter(item => parseInt(item.thematique) === parseInt(thematique))
        }
        //liste = liste.filter(item => item.priorite !== null)
        liste = liste.sort((a, b) => a.priorite - b.priorite)
        setResultat(liste.sort((a, b) => a.titre_search < b.titre_search ? -1 : 1))
    }

    return loading ? <Loading /> :  (
        <SafeAreaView style={styles.global} >
            <BluetothList navigation={props.navigation}/>
            <StatusBar barStyle="light-content" />

            <View style={styles.formulaire}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 2 }}>
                    <Text style={{fontFamily: "Poppins-Bold", color: "#de382f"}}>{texte.mot.titre}</Text>
                    <SimpleLineIcons name="refresh" size={20} color="#de382f" onPress={() => onChangeMotCle('')} />
                </View>

                <TextInput

                    style={{ fontFamily : "Poppins-Light", height: 35, marginRight : 15, paddingTop: 2,
                        width : "100%", color : "#de382f", backgroundColor: 'white',
                        borderColor: '#de382f', borderBottomWidth: 1 }}
                    onChangeText={text => onChangeMotCle(text)}
                    value={motCle}
                    placeholder = {texte.mot.placeholder}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10}}>
                    <Text style={{fontFamily: "Poppins-Bold", color: "#de382f"}}>{texte.cate.titre}</Text>
                    <SimpleLineIcons name="refresh" size={20} color="#de382f" onPress={() => setCategorie(null)} />
                </View>

                <DropDownPicker
                    items={categItems}
                    open={categOpen}
                    value={categorie}
                    setOpen={setCategOpen}
                    setValue={setCategorie}
                    zIndex={7000}
                    placeholder = {texte.cate.placeholder}
                    containerStyle={{height: 45}}
                    style={{backgroundColor: 'white', borderWidth : 1, borderColor : "#de382f", borderRadius : 50}}
                    itemStyle={{
                        justifyContent: 'flex-start'
                    }}
                    dropDownStyle={{backgroundColor: 'red', borderColor:"#de382f"}}
                    arrowStyle={{marginRight: 10, backgroundColor:"red", color:"#de382f"}}
                    arrowColor = "#de382f"
                    placeholderStyle={styles.place_holder}
                    selectedLabelStyle={styles.label_active}
                    labelStyle={styles.content_select}
                    onChangeValue = {value => {
                        let listeSave = sousCategItemsSave
                        let sousCat = listeSave.filter(save => save.categorie.indexOf(value) > -1)
                        setSousCategItems(sousCat)
                    }}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10}}>
                    <Text style={{fontFamily: "Poppins-Bold", color: "#de382f"}}>{texte.sous.titre}</Text>
                    <SimpleLineIcons name="refresh" size={20} color="#de382f" onPress={() => setSousCategorie(null)} />
                </View>

                <DropDownPicker
                    open={sousCategOpen}
                    value={sousCategorie}
                    setOpen={setSousCategOpen}
                    setValue={setSousCategorie}
                    items={sousCategItems}
                    zIndex={5000}
                    placeholder = {texte.sous.placeholder}
                    containerStyle={{height: 45}}
                    style={{backgroundColor: 'white', borderWidth : 1, borderColor : "#de382f", borderRadius : 50}}
                    itemStyle={{
                        justifyContent: 'flex-start'
                    }}
                    dropDownStyle={{backgroundColor: 'red', borderColor:"#de382f"}}
                    arrowStyle={{marginRight: 10, backgroundColor:"red", color:"#de382f"}}
                    arrowColor = "#de382f"
                    placeholderStyle={styles.place_holder}
                    selectedLabelStyle={styles.label_active}
                    labelStyle={styles.content_select}
                />


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                    <Text style={{fontFamily: "Poppins-Bold", color: "#de382f"}}>{texte.theme.titre}</Text>
                    <SimpleLineIcons name="refresh" size={20} color="#de382f" onPress={() => setThematique(null)} />
                </View>

                <DropDownPicker
                    open={thematiqueOpen}
                    value={thematique}
                    setOpen={setThematiqueOpen}
                    setValue={setThematique}
                    items={thematiqueItems}
                    zIndex={1000}
                    placeholder = {texte.theme.placeholder}
                    containerStyle={{height: 45}}
                    style={{backgroundColor: 'white', borderWidth : 1, borderColor : "#de382f", borderRadius : 50}}
                    itemStyle={{
                        justifyContent: 'flex-start'
                    }}
                    dropDownStyle={{backgroundColor: 'red', borderColor:"#de382f"}}
                    arrowStyle={{marginRight: 10, backgroundColor:"red", color:"#de382f"}}
                    arrowColor = "#de382f"
                    placeholderStyle={styles.place_holder}
                    selectedLabelStyle={styles.label_active}
                    labelStyle={styles.content_select}
                />

                <TouchableOpacity onPress={() => valider()}
                    style={{marginTop:15, justifyContent:"center", alignItems:"center", borderRadius:50, backgroundColor:"#de382f", width: "100%", height:40}}>
                    <Text style={{color:"white", fontFamily: "Poppins-Bold"}}>{texte.btn}</Text>
                </TouchableOpacity>
            </View>

            {
                (resultat.length === 0 && search) ?
                <Text style={{fontFamily: "Poppins-Bold", color: "#de382f", textAlign: 'center', marginTop: 50}}>Pas de résultat trouvé !</Text>
                :
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* La liste des résultats de la recherche */}
                    <View style={{height:"100%", width:"100%", marginBottom: 30, padding: 10}} >
                        {
                            resultat.map((item, i) => (
                                <TouchableOpacity style={styles.main_unite} key={i} onPress={() => props.navigation.navigate("Interet", {theme: item, titre: getThemeLangText(item).titre})}>
                                    <Image
                                        source={item.image ? {uri: item.image} : images[Math.floor(Math.random()*images.length)]}
                                        style={styles.image}
                                    />

                                    <View style={styles.content_unite}>
                                        <Text style={styles.text__titre__decouvrir} numberOfLines={1}>{getThemeLangText(item).titre}</Text>
                                        <Text numberOfLines={2} style={[styles.text__bouton__afficher__parcours, {color: 'black', textAlign: 'left', fontSize: 10}]}>
                                            {getThemeLangText(item).description}...
                                        </Text>
                                    </View>

                                    <View style={styles.bloc__icon__bouton__decouvrir}>
                                        <SimpleLineIcons name="arrow-right" size={20} color="#de382f" />
                                    </View>

                                </TouchableOpacity>
                            ))

                        }
                    </View>

                </ScrollView>
            }

        </SafeAreaView>

    )
}

export default Recherche

const styles = StyleSheet.create({

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
    text__bouton__afficher__parcours: {
        fontFamily : "Poppins-Bold",
        fontSize: 13,
        color: "white",
        textAlign: "center",
    },

    text__titre__decouvrir: {
        fontFamily : "Poppins-Bold",
        fontSize: 15,
        color: "#de382f",
        textAlign: "left"
    },
    bloc__decouvrir: {
        width:"100%",
        height: 150,
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
        paddingBottom: 15,
    },
    bloc__image__decouvrir: {
        width: "20%",
        height: 50,
    },
    bloc__titre__decouvrir: {
        width: "70%",
        height: 100,
        justifyContent: "center",
        alignItems: "center"
    },
    bloc__icon__bouton__decouvrir: {
        width: "10%",
        height: 100,
        justifyContent: "center",
        alignItems: "center"
    },

    global:{
        width: "100%",
        height:"100%",
        backgroundColor: "white"
    },
    formulaire: {
        width: "100%",
        flexDirection: "column",
        justifyContent:"flex-start",
        alignItems: "flex-start",
        paddingLeft:30,
        paddingRight:30,
        marginBottom: 10
    },
    place_holder : {
        color : "#939393",
        fontFamily : "Poppins-Light",
        fontSize: 15,
      },
      content_select : {
        justifyContent: 'flex-start',
        color : "#939393",
        fontFamily : "Poppins-Light",
        fontSize: 15,
      },
      label_active : {
            color: '#39739d'
        }
})
