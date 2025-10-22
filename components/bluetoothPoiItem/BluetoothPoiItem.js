import React, { Component, useState , useEffect  } from 'react' 
import {
    TouchableOpacity,
    View,
    Text
} from 'react-native'

import AutoHeightImage from 'react-native-auto-height-image'
import ScreenDimensions from '../../configs/ScreenDimensions'
//import Icones from '../../assets/Icones'
import BluetoothPoiItemStyle from './BluetoothPoiItemStyle'
const BluetoothPoiItem  = props => {
    useEffect(() => {
        console.log('BT item'+ JSON.stringify(props.item))
    })
    return (
        <TouchableOpacity 
            onPress={()=>{
                props._clickItem(props.item)
            }}
            style={BluetoothPoiItemStyle.container}>
             <AutoHeightImage
                style={BluetoothPoiItemStyle.styleImagePOI}
                width={ScreenDimensions.widthScreen * 0.15}
                source={{ uri: props.item.image }}
            />
            <View style={BluetoothPoiItemStyle.containerTextPOI}>
                <View style={BluetoothPoiItemStyle.InfosPOI}>
                    <Text style={BluetoothPoiItemStyle.titlePOI}>{props.item.titre}</Text>
                    <Text numberOfLines={2} style={BluetoothPoiItemStyle.descriptionPOI}>{props.item.description}</Text>
                </View>
                {/*<AutoHeightImage
                    width={ScreenDimensions.widthScreen * 0.03}
                    source={Icones.icGoRight}
                />*/}
            </View>
        </TouchableOpacity>
    )
}
export default BluetoothPoiItem