import { useNavigation } from '@react-navigation/native'
import React, {  useState,useEffect } from 'react'
import {
    Modal,
    View,
    Text,
    FlatList,
    TouchableOpacity
} from 'react-native'
import { useSelector, useDispatch, connect } from 'react-redux'
 import BluetoothPoiItem  from '../bluetoothPoiItem/BluetoothPoiItem'
import {SET_POPUP_BT } from '../../store/types/PoiType' 
import { functions } from '../../helpers/Constants'
import BluetothListStyle from './BluetothListStyle'
const BluetothList  = props => {
    const dispatch = useDispatch();
    const [language, setLanguage] = useState('fr')
    //useSelector((state: any) => state.Languages.languages);
    const currentListPoiBT =   useSelector((state) => state.Poi.currentListPoiBT);
    const currentPopupBT =  useSelector((state) => state.Poi.currentPopupBT);
    //const navigation = useNavigation()
    const _clickItem = (item) => {
        
            props.navigation.navigate('Interet', {theme: item })
            setTimeout(async() => {
                console.log('setTimeout:: CLOSE')
                await dispatch({ type: SET_POPUP_BT, value: false })
       
              }, 1000);
    }
    useEffect(() => {
        functions.getLang()
            .then(lang => {
                setLanguage(lang)
            })
    }, [])
    const  _clickCancel = () => {
        setTimeout(async() => {
            await dispatch({ type: SET_POPUP_BT, value: false })
          }, 600);
    }
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={(currentPopupBT==true && currentListPoiBT.length>0)?true: false}
            onRequestClose={() => {}}>     
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)'}}>
                    <View 
                        style={BluetothListStyle.container}>
                        <Text 
                            style={BluetothListStyle.labelBluetothList} >{language=='fr'?'Liste des bornes connectées':'Lists of connected Bluetooth' }</Text>
                            {
                                currentListPoiBT.length>0?
                               <FlatList
                                    style={BluetothListStyle.flatListBluetothList}
                                    data={currentListPoiBT}
                                    extraData={currentListPoiBT}
                                    keyExtractor={(item, id) => id.toString()}
                                    renderItem={({ item }) =>
                                    <BluetoothPoiItem 
                                        navigation={props.navigation}
                                        item={item}
                                        _clickItem={_clickItem}/>}
                                        onEndReachedThreshold={0.5}
                                        onEndReached={async () => {
                                        }}
                                />
                                :<Text style={BluetothListStyle.noBluetothList} >{language=='fr'?"Veuillez activer votre Bluetooth dans vos paramètres puis relancez l'application !":"Please activate your Bluetooth in your settings then relaunch the application!"}</Text>}
                        <TouchableOpacity 
                            onPress={_clickCancel}
                            style={BluetothListStyle.containerButtonCancel}>
                            <Text style={[ BluetothListStyle.labelCancel]}>{language=='fr'?'Fermer': 'Close'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>   
        </Modal>
    )
}

export default BluetothList