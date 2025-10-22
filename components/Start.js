import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from 'react-native'

const Start = () => {

    const afficherMenuFrancais = () => {
        navigation.navigate("Acceuil", {type: 'Accueil'})
    }

    return (
        <View style={styles.container}>
        <View style={styles.logo__content}>
          <Image style={styles.logo} source={require('../assets/images/logo.png')}/>
        </View>
        <View style={styles.langue__contenu}>
            <Text style={styles.titre__info_choix}>Selectionnez Votre Langue</Text>
            <View style={styles.choix__langue}>
                <TouchableOpacity style={styles.bloc__drapeau} onPress={afficherMenuFrancais}>
                    <Image 
                      source={require('../assets/images/francais.png')}
                      style={{ marginRight: 10, borderRadius: 40/2, width: 40, height: 40 }} 
                      
                    />
                    <Text style={styles.titre__langue}>Français</Text>
                </TouchableOpacity> 

                <TouchableOpacity style={styles.bloc__drapeau}>
                    <Image 
                      source={require('../assets/images/anglais.png')}
                      style={{ marginRight: 10, borderRadius: 40/2, width: 40, height: 40 }} 
                      
                    />
                    <Text style={styles.titre__langue}>Anglais</Text>
                </TouchableOpacity> 
               
            </View>
        </View>
        
      <StatusBar style="auto" />
    </View>
    )
}

export default Start

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: '#fff',
        flexDirection : "column",
        alignItems: 'center',
        justifyContent: 'center',
      },
    
      logo__content : {
        width : "100%",
        height : "60%",
        paddingTop : 25,
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
      },
    
      langue__contenu : {
        width : "100%",
        height : "40%",
        flexDirection : "column",
        justifyContent : "center",
        alignItems : "center",
      },
    
      logo: {
        width: "100%",
        height: "100%"
      },
    
      loader__content: {
        width : "100%",
        height : "40%",
      },
    
      choix__langue: {
        width: "90%",
        height: "25%",
        flexDirection:"row",
        justifyContent:"center",
        alignItems: "center",
        backgroundColor: "green",
        borderRadius: 35,
        marginTop: 10
      },
    
      bloc__drapeau: {
        flexDirection: "row", 
        justifyContent: "center",
        alignItems : "center",
        width:"50%",
        height: "100%",
      },
    
    bloc__titre__langue : {
      width: "70%",
      height : "100%"
    },
    
    titre__info_choix : {
      color : "black",
      fontFamily : "Poppins-Light",
      fontSize: 18,
    }, 
    
    titre__langue : {
      color : "black",
      fontFamily : "Poppins-Bold",
      fontSize: 18,
    }
})
