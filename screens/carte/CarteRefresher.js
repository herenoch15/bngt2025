import React, {useEffect, useState} from 'react'
import { StyleSheet, View } from 'react-native'
import Loading from '../../components/Loading'
import { functions } from '../../helpers/Constants'
import {
  Dropdown,
  GroupDropdown,
  MultiselectDropdown,
} from 'sharingan-rn-modal-dropdown';
import {useNetInfo} from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CarteRefresher = props => {
    const {navigation, route} = props
    const netInfo = useNetInfo();


    const [search, onChangeSearch] = useState('');
    const [text, setText] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      navigation.navigate("Carte");

    }, [netInfo.isConnected])



    return loading ? <Loading /> : (
        <View style={styles.container}>
        </View>
    )
}

export default CarteRefresher

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: "white"
      },
    bloc__recherche: {
        width: "100%",
        height: "18%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    bloc__carte: {
        width: "100%",
        height: "82%"
    },
    map: {
        width: "100%",
        height: "100%"
    }

})
