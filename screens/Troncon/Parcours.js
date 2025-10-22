import React from 'react'
import { StyleSheet, Text, View, Image, ImageBackground, StatusBar, TouchableOpacity, ScrollView } from 'react-native'
import Swiper from 'react-native-swiper'
import BluetothList from '../../components/bluetothList/BluetothList'
const Parcours = props => {

    const {navigation} = props

    const afficherUnite = () => {
        navigation.navigate("Unite", {type: 'Unite'})
    }

    return (
        <View style={styles.container}>
            <BluetothList navigation={navigation}/>
            <ImageBackground style={ styles.imgBackground } 
                 resizeMode='cover' 
                 source={require('../../assets/images/back.jpg')}>
            <Swiper style={styles.bloc__slider__parcours}>
                <View style={styles.container__parcours__info}>
                    <View style={styles.bloc__titre__parcours}>
                        <Text style={styles.titre__parcours}>D'un bourg à l'autre</Text>
                        <Text style={styles.numero__parcours}>1/4</Text>
                    </View>

                    <View style={styles.image__parcours}>
                    <Image 
                        source={require('../../assets/images/1.jpg')}
                        style={{width: "100%", height: "100%" }} 
                        
                      />
                    </View>
                   
                        
                    <ScrollView style={styles.bloc__description__parcours}
                        showsPagination= {false}
                        showsButtons={false}
                    >
                        <Text style={styles.description__parcours}>
                        Le Lorem Ipsum est simplement 
                        du faux texte employé dans la 
                        composition et la mise en page 
                        avant impression. 

                        Le Lorem Ipsum est le faux texte 
                        standard de l'imprimerie depuis les années 1500, 
                        quand un imprimeur anonyme assembla ensemble des
                         morceaux de texte pour réaliser un livre spécimen 
                         de polices de texte. 
                         
                         Il n'a pas fait que survivre 
                         cinq siècles, mais s'est aussi adapté à la 
                         bureautique informatique, sans que son contenu 
                         n'en soit modifié. Il a été popularisé 
                         dans les années 1960 grâce à la vente de 
                         feuilles Letraset contenant.
                         Le Lorem Ipsum est simplement 
                        du faux texte employé dans la 
                        composition et la mise en page 
                        avant impression. 
                        Le Lorem Ipsum est simplement 
                        du faux texte employé dans la 
                        composition et la mise en page 
                        avant impression. 
                        </Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.bouton__afficher__parcours} onPress={afficherUnite}>
                        <Text style={styles.text__bouton__afficher__parcours}>Afficher les Parcours</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.container__parcours__info}>
                    <View style={styles.bloc__titre__parcours}>
                        <Text style={styles.titre__parcours}>D'un bourg à l'autre second</Text>
                        <Text style={styles.numero__parcours}>2/4</Text>
                    </View>

                    <View style={styles.image__parcours}>
                    <Image 
                        source={require('../../assets/images/1.jpg')}
                        style={{width: "100%", height: "100%" }} 
                        
                      />
                    </View>
                   
                        
                    <ScrollView style={styles.bloc__description__parcours}>
                        <Text style={styles.description__parcours}>
                        Le Lorem Ipsum est simplement 
                        du faux texte employé dans la 
                        composition et la mise en page 
                        avant impression. 

                        Le Lorem Ipsum est le faux texte 
                        standard de l'imprimerie depuis les années 1500, 
                        quand un imprimeur anonyme assembla ensemble des
                         morceaux de texte pour réaliser un livre spécimen 
                         de polices de texte. 
                         
                         Il n'a pas fait que survivre 
                         cinq siècles, mais s'est aussi adapté à la 
                         bureautique informatique, sans que son contenu 
                         n'en soit modifié. Il a été popularisé 
                         dans les années 1960 grâce à la vente de 
                         feuilles Letraset contenant.
                         Le Lorem Ipsum est simplement 
                        du faux texte employé dans la 
                        composition et la mise en page 
                        avant impression. 
                        Le Lorem Ipsum est simplement 
                        du faux texte employé dans la 
                        composition et la mise en page 
                        avant impression. 
                        </Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.bouton__afficher__parcours}>
                        <Text style={styles.text__bouton__afficher__parcours}>Afficher les Parcours</Text>
                    </TouchableOpacity>
                </View>
                
            </Swiper>
               
            </ImageBackground>
            <StatusBar style="auto" />
        </View>
    )
}

export default Parcours

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
        flexDirection : "column",
        justifyContent:  "flex-start",
        alignItems: 'center',
},

    container__parcours__info: {
        width: "85%", 
        height: "90%",
        marginTop: "10%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    bloc__titre__parcours: {
        width: "100%",
        height: "7%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "green",
        padding: 15,
        borderTopLeftRadius: 20,
    }, 
    titre__parcours: {
        fontFamily : "Poppins-Bold",
        fontSize: 14,
        color: "white",
        textAlign: "center"
    },
    numero__parcours: {
        fontFamily : "Poppins-Bold",
        fontSize: 10,
        color: "#ebdb34",
        textAlign: "center"
    },
    image__parcours: {
        width: "100%",
        height: "30%"
    },
    bloc__description__parcours: {
        width: "100%",
        height: "43%",
        padding: 15,
    },
    description__parcours: {
        fontFamily : "Poppins-Light",
        fontSize: 13,
        color: "black",
        textAlign: "justify"
    },
    bouton__afficher__parcours: {
        width: "80%",
        height: "8%",
        marginBottom: "2%",
        backgroundColor: "green",
        borderRadius: 25,
        flexDirection:"column",
        justifyContent: "center"
    },
    text__bouton__afficher__parcours: {
        fontFamily : "Poppins-Bold",
        fontSize: 13,
        color: "white",
        textAlign: "center",
    },
    bloc__slider__parcours: {
       paddingLeft: "7%"
    }
})
